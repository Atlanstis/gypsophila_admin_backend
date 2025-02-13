import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { MenuAddDto, MenuEditDto } from './dto';
import { BusinessException, CommonPageDto } from 'src/core';
import { sortMenuChildren } from './helper';
import {
  execSingleStrategy,
  findOneByExistError,
  findOneByNotExistError,
  getSkipTake,
} from 'src/utils';
import { EnumMenuKey } from 'src/constants';
import { RoleService } from '../role/role.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  /**
   * 根据页码跟长度获取一、二级菜单
   * @param page 页码
   * @param size 长度
   * @returns 菜单列表
   */
  async list(
    dto: CommonPageDto,
    payload: App.JwtPayload,
  ): Promise<ResCommon.TableData<ResMenu.MenuListData>> {
    const { skip, take } = getSkipTake(dto.page, dto.size);
    const [menus, total] = await this.menuRepo.findAndCount({
      where: {
        parentId: IsNull(),
      },
      skip,
      take,
      order: {
        order: 'ASC',
      },
    });
    // 获取次级菜单
    const secondaryMenus = await this.getSecondaryMenu(menus);
    const menuSorted = sortMenuChildren(menus, secondaryMenus);

    // 获取权限
    const permission = await this.getPermission(payload.roleIds);

    const formattedMenus = menuSorted.map((menu) => {
      const menuAddStrategies = [
        // 是否拥有编辑权限
        () => permission.add,
      ];
      // 顶级菜单新增子菜单的策略
      const topMenuAddStrategies = [
        ...menuAddStrategies,
        // 菜单类型为"菜单"类型，才能新增
        () => menu.type === 'menu',
        // 顶级菜单可新增子菜单
        () => true,
      ];

      // 次级新增权限的策略
      const secondaryMenuAddStrategies = [
        ...menuAddStrategies,
        // 次级菜单不可新增子菜单
        () => false,
      ];

      // 编辑菜单的策略
      const editStrategies = [
        // 是否拥有编辑权限
        () => permission.edit,
      ];

      // 删除菜单的策略
      const deleteStrategies = [
        // 是否拥有删除权限
        () => permission.delete,
      ];

      // 权限管理的策略
      const permissionStrategies = [
        // 是否拥有权限管理权限
        () => permission.permissionManage,
      ];

      let children: ResMenu.MenuListData[] = [];

      if (menu.children) {
        children = menu.children.map((secondary) => {
          return {
            ...secondary,
            children: [],
            permission: {
              add: execSingleStrategy(secondaryMenuAddStrategies),
              edit: execSingleStrategy(editStrategies),
              delete: execSingleStrategy(deleteStrategies),
              permissionManage: execSingleStrategy([
                ...permissionStrategies,
                // "页面"类型，可以进行权限管理
                () => secondary.type === 'page',
              ]),
            },
          };
        });
      }
      return {
        ...menu,
        children,
        permission: {
          add: execSingleStrategy(topMenuAddStrategies),
          edit: execSingleStrategy(editStrategies),
          delete: execSingleStrategy(deleteStrategies),
          permissionManage: execSingleStrategy([
            ...permissionStrategies,
            // "页面"类型，可以进行权限管理
            () => menu.type === 'page',
          ]),
        },
      };
    });

    return { list: formattedMenus, total };
  }

  /** 获取所有菜单及下面的菜单 */
  async getMenus() {
    const topMenus = await this.menuRepo.find({
      where: { parentId: IsNull() },
      order: {
        order: 'ASC',
      },
    });
    const children = await this.getSecondaryMenu(topMenus, true);
    return sortMenuChildren(topMenus, children);
  }

  /**
   * 添加菜单
   * @param dto 菜单数据
   */
  async add(dto: MenuAddDto) {
    await findOneByExistError(
      this.dataSource,
      Menu,
      { key: dto.key },
      '菜单标识已存在，请更换后重试',
    );

    const newMenu = this.menuRepo.create(dto);
    // 判断上级菜单是否存在
    if (dto.parentId) {
      const parent = await findOneByNotExistError(
        this.dataSource,
        Menu,
        { id: dto.parentId },
        '上级菜单不存在',
      );
      newMenu.parent = parent;
    }
    await this.menuRepo.save(newMenu);
  }

  /**
   * 编辑菜单
   * @param dto 菜单数据
   */
  async edit(dto: MenuEditDto) {
    // 判断当前菜单是否存在
    await findOneByNotExistError(
      this.dataSource,
      Menu,
      { id: dto.id },
      '该菜单不存在',
    );
    // 判断菜单标识已否被使用
    await findOneByExistError(
      this.dataSource,
      Menu,
      { key: dto.key, id: Not(dto.id) },
      '当前菜单标识已存在',
    );
    const newMenu = this.menuRepo.create(dto);
    await this.menuRepo.save(newMenu);
  }

  /**
   * 删除菜单
   * @param id 菜单 id
   */
  async delete(id: number) {
    // 判断当前菜单是否存在
    const menu = await findOneByNotExistError(
      this.dataSource,
      Menu,
      { id: id },
      '该菜单不存在',
    );
    // 如含有子菜单，则不让删除
    const child = await this.menuRepo.findOne({
      where: { parentId: menu.id },
    });
    if (child) {
      throw new BusinessException('请先删除相关的子菜单');
    }
    await this.menuRepo.delete({ id });
  }

  /** 获取一级菜单数据 */
  async listTop(): Promise<ResMenu.Menu[]> {
    return await this.menuRepo.find({
      where: {
        parentId: IsNull(),
      },
      order: {
        order: 'ASC',
      },
    });
  }

  /**
   * 获取顶级菜单的子菜单
   * @param topMenus 顶级菜单
   * @param hasPermission 是否关联查询权限
   * @returns 菜单
   */
  async getSecondaryMenu(topMenus: Menu[], hasPermission = false) {
    const parentIds = topMenus.map((menu) => menu.id);
    const children = await this.menuRepo.find({
      where: {
        parentId: In(parentIds),
      },
      relations: {
        permissions: hasPermission,
      },
    });
    return children;
  }

  /**
   * 获取菜单管理页面相关配置
   * @param roleIds 角色 id 列表
   */
  async getPageConfig(roleIds: number[]): Promise<ResMenu.Config> {
    const permission = await this.getPermission(roleIds);

    return {
      permission,
    };
  }

  async getPermission(roleIds: number[]) {
    const key = EnumMenuKey.ManagementMenu;
    return this.roleService.getRoleMenuPermissionMap<ResMenu.ConfigPermission>(
      roleIds,
      key,
    );
  }
}

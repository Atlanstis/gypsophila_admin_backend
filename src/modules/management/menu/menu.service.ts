import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { MenuAddDto, MenuEditDto } from './dto';
import { BusinessException, CommonPageDto } from 'src/core';
import {
  findOneByExistError,
  findOneByNotExistError,
  getSkipTake,
} from 'src/utils';
import { EnumMenuKey } from 'src/constants';
import { RoleService } from '../role/role.service';
import { buildMenuPermissionTree, combineMenuPermission } from './helper';

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
   * 根据页码跟长度获取菜单
   * @param page 页码
   * @param size 长度
   * @returns 菜单列表
   */
  async list(
    dto: CommonPageDto,
    payload: App.JwtPayload,
  ): Promise<ResCommon.TableData<ResMenu.MenuListData>> {
    const { skip, take } = getSkipTake(dto.page, dto.size);
    // 获取指定数量的顶级菜单
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
    // 获取所有子菜单
    const allChildren = await this.menuRepo.find({
      where: {
        parentId: Not(IsNull()),
      },
      order: {
        order: 'ASC',
      },
    });

    // 获取权限
    const permission = await this.getPermission(payload.roleIds);

    // 构建树形结构
    const list = menus.map((menu) => ({
      ...combineMenuPermission(
        menu,
        permission,
        buildMenuPermissionTree(menu.id, allChildren, permission),
      ),
    }));

    return {
      list,
      total,
    };
  }

  /** 获取所有菜单及下面的菜单 */
  async getMenus() {
    // 一次性获取所有菜单
    const allMenus = await this.menuRepo.find({
      order: {
        order: 'ASC',
      },
      relations: {
        permissions: true,
      },
    });

    // 构建菜单映射表
    const menuMap = new Map<number, ResMenu.MenuWithChildren>();
    allMenus.forEach((menu) => {
      menu.permissions.sort((a, b) => a.order - b.order);
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // 构建树形结构
    const tree: ResMenu.MenuWithChildren[] = [];
    allMenus.forEach((menu) => {
      const menuWithChildren = menuMap.get(menu.id);
      if (!menuWithChildren) return;
      if (menu.parentId === null) {
        tree.push(menuWithChildren);
      } else {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children.push(menuWithChildren);
        }
      }
    });
    return tree;
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

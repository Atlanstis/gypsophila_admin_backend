import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, Permission, RoleMenuPermission } from 'src/entities';
import { FindOptionsSelect, In, Not, Repository } from 'typeorm';
import { MenuDto, MenuEditDto, PermissionDto, PermissionEditDto } from './dto';
import { BusinessException } from 'src/core';
import { TOP_LEVEL_MENU_FLAG } from 'src/constants';
import { sortMenuChildren } from './helper';

const select: FindOptionsSelect<Menu> = { id: true, key: true, name: true, parentId: true };

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepoitory: Repository<Menu>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RoleMenuPermission)
    private readonly rmpRepository: Repository<RoleMenuPermission>,
  ) {}

  /**
   * 根据页码跟长度获取一级菜单列表及其子菜单
   * @param page 页码
   * @param size 长度
   * @returns 菜单列表
   */
  async list(page: number, size: number) {
    const [list, total] = await this.menuRepoitory.findAndCount({
      select,
      where: {
        parentId: TOP_LEVEL_MENU_FLAG,
      },
      skip: (page - 1) * size,
      take: size,
      order: {
        id: 'ASC',
      },
    });
    const children = await this.getChildrenMenu(list);
    const menus = sortMenuChildren(list, children);
    return { list: menus, total };
  }

  /** 获取所有菜单及下面的菜单 */
  async getMenuPermissions() {
    const topMenus = await this.menuRepoitory.find({
      select,
      where: { parentId: TOP_LEVEL_MENU_FLAG },
      order: {
        id: 'ASC',
      },
      relations: {
        permissions: true,
      },
    });
    const children = await this.getChildrenMenu(topMenus, true);
    return sortMenuChildren(topMenus, children);
  }

  /**
   * 添加菜单
   * @param dto 菜单数据
   */
  async add(dto: MenuDto) {
    // 判断 key 是否已存在
    const existMenu = await this.menuRepoitory.findOne({ where: { key: dto.key } });
    if (existMenu) {
      throw new BusinessException('菜单 Key 已存在');
    }
    // 判断上级菜单是否存在
    if (dto.parentId !== TOP_LEVEL_MENU_FLAG) {
      const parentMenu = await this.menuRepoitory.findOne({ where: { id: dto.parentId } });
      if (!parentMenu) {
        throw new BusinessException('上级菜单不存在');
      }
    }
    const newMenu = this.menuRepoitory.create(dto);
    await this.menuRepoitory.save(newMenu);
  }

  /**
   * 编辑菜单
   * @param dto 菜单数据
   */
  async edit(dto: MenuEditDto) {
    // 判断当前菜单是否存在
    const existMenu = await await this.getMenuById(dto.id);
    if (!existMenu) {
      throw new BusinessException('该菜单不存在');
    }
    // 判断 Key 已否被使用
    const existKeyMenu = await this.menuRepoitory.findOne({
      where: { key: dto.key, id: Not(dto.id) },
    });
    if (existKeyMenu) {
      throw new BusinessException('当前菜单 Key 已存在');
    }
    const newMenu = this.menuRepoitory.create(dto);
    await this.menuRepoitory.update({ id: dto.id }, newMenu);
  }

  /**
   * 删除菜单
   * @param id 菜单 id
   */
  async delete(id: number) {
    // 判断当前菜单是否存在
    const existMenu = await this.getMenuById(id);
    if (!existMenu) {
      throw new BusinessException('该菜单不存在');
    }
    // 如含有子菜单，则不让删除
    const children = await this.menuRepoitory.find({ where: { parentId: id } });
    if (children.length) {
      throw new BusinessException('请先删除相关的子菜单');
    }
    await this.menuRepoitory.delete({ id });
  }

  /** 获取一级菜单数据 */
  async listTop() {
    return await this.menuRepoitory.find({
      select,
      where: {
        parentId: TOP_LEVEL_MENU_FLAG,
      },
    });
  }

  /**
   * 根据 key 获取菜单组
   * @param menus key 数组
   * @returns 菜单组
   */
  async getMenuByKey(menus: string[]) {
    return await this.menuRepoitory.find({
      where: {
        key: In(menus),
      },
    });
  }

  /**
   * 获取顶级菜单的子菜单
   * @param topMenus 顶级菜单
   * @param hasPermission 是否关联查询权限
   * @returns 菜单
   */
  async getChildrenMenu(topMenus: Menu[], hasPermission: boolean = false) {
    const parentIds = topMenus.map((menu) => menu.id);
    const children = await this.menuRepoitory.find({
      select,
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
   * 根据 id 获取菜单
   * @param id 菜单 id
   * @returns 菜单
   */
  async getMenuById(id: number) {
    return await this.menuRepoitory.findOne({
      select,
      where: { id },
    });
  }

  /**
   * 菜单增加权限选项
   * @param dto 权限
   */
  async permissionAdd(dto: PermissionDto) {
    const menu = await this.getMenuById(dto.menuId);
    if (!menu) {
      throw new BusinessException('该菜单不存在');
    }
    const existPermission = await this.permissionRepository.findOne({ where: { key: dto.key } });
    if (existPermission) {
      throw new BusinessException('该权限 Key 已存在');
    }
    const permission = this.permissionRepository.create({ ...dto, menu });
    await this.permissionRepository.save(permission);
  }

  /**
   * 菜单权限选项编辑
   * @param dto 权限
   */
  async permissionEdit(dto: PermissionEditDto) {
    const menu = await this.getMenuById(dto.menuId);
    if (!menu) {
      throw new BusinessException('该菜单不存在');
    }
    const existPermission = await this.permissionRepository.findOne({ where: { key: dto.key } });
    if (existPermission && existPermission.id !== dto.id) {
      throw new BusinessException('该权限 Key 已存在');
    }
    const permission = this.permissionRepository.create({ ...dto, menu });
    await this.permissionRepository.save(permission);
  }

  /**
   * 菜单权限选项删除
   * @param id 权限 id
   */
  async permissionDelete(id: number) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new BusinessException('该权限不存在');
    }
    /** 判断当前权限是否被使用 */
    const rmp = await this.rmpRepository
      .createQueryBuilder('rmp')
      .select('rmp.id')
      .where('rmp.permission_id = :id', { id })
      .getMany();
    if (rmp.length > 0) {
      throw new BusinessException('该权限已被引用，无法删除');
    }
    await this.permissionRepository.delete({ id });
  }

  /**
   * 获取菜单权限选项
   * @param menuId 菜单 id
   */
  async permissionList(menuId: number) {
    const menu = await this.menuRepoitory.findOne({
      select: { id: true },
      where: { id: menuId },
      relations: {
        permissions: true,
      },
    });
    if (!menu) {
      throw new BusinessException('该菜单不存在');
    }
    return menu.permissions;
  }
}

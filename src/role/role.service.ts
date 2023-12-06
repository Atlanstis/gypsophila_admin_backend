import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, Permission, Role, RoleMenuPermission } from 'src/entities';
import { In, Not, Repository } from 'typeorm';
import { RoleDto, RoleEditDto, RoleMenuEditDto } from './dto';
import { BusinessException } from 'src/core';
import { RoleEnum } from 'src/enum';
import { MenuService } from 'src/menu/menu.service';
import { RoleIsDefaultEnum } from 'src/constants';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RoleMenuPermission)
    private readonly roleMenuPermissionRepository: Repository<RoleMenuPermission>,
    private readonly menuService: MenuService,
  ) {}

  /**
   * 获取角色列表
   * @param page 页码
   * @param size 条数
   * @returns 角色列表
   */
  async list(page: number, size: number) {
    const [list, total] = await this.roleRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: {
        createTime: 'ASC',
      },
    });
    return { list, total };
  }

  /**
   * 新增角色
   * @param dto 角色信息
   */
  async add(dto: RoleDto) {
    const existedRole = await this.roleRepository.findOne({ where: { name: dto.name } });
    if (existedRole) {
      throw new BusinessException('角色名已存在');
    }
    const newRole = this.roleRepository.create({ ...dto });
    await this.roleRepository.save(newRole);
  }

  /**
   * 编辑角色
   * @param dto 角色信息
   */
  async edit(dto: RoleEditDto) {
    const existedRole = await this.roleRepository.findOne({ where: { id: dto.id } });
    if (!existedRole) {
      throw new BusinessException('角色不存在');
    }
    const updateRole = this.roleRepository.create(dto);
    await this.roleRepository.update({ id: dto.id }, updateRole);
  }

  /**
   * 删除角色
   * @param id 角色 id
   */
  async delete(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id: id },
      relations: { users: true },
    });
    if (!role) {
      throw new BusinessException('角色不存在');
    }
    if (role.isDefault === RoleIsDefaultEnum.YES) {
      throw new BusinessException('内置角色不能删除');
    }
    if (role.users.length) {
      throw new BusinessException('当前角色已被用户关联，无法删除');
    }
    await this.roleRepository.delete({ id });
  }

  /**
   * 获取可以分配的角色
   * @returns 除超级管理员外的角色
   */
  async assignable() {
    return await this.roleRepository.find({ where: { id: Not(RoleEnum.Admin) } });
  }

  /**
   * 获取该角色下可以访问的菜单
   * @param id 角色 id
   * @returns 授权菜单
   */
  async menuPermission(id: number) {
    /** 获取该角色下可访问的菜单 */
    const role = await this.roleRepository.findOne({
      select: { menus: true },
      where: { id },
      relations: { menus: true },
    });
    if (!role) {
      throw new BusinessException('该角色不存在');
    }
    /** 获取各菜单的权限 */
    const rmps = await this.getPermissionByRoleIds([id]);
    const map: Record<string, string[]> = {};
    rmps.forEach(({ menu, permission }) => {
      const menuKey = menu.key;
      const permissionKey = permission.key;
      if (!map[menuKey]) {
        map[menuKey] = [permissionKey];
      } else {
        map[menuKey].push(permissionKey);
      }
    });

    /** 获取所有菜单及下面的菜单 */
    const list = await this.menuService.getMenuPermissions();

    return {
      list,
      menus: role.menus.map((item) => item.key),
      permissions: map,
    };
  }

  /**
   * 编辑该角色下可以访问的菜单
   */
  async menuPermissionEdit(dto: RoleMenuEditDto) {
    const role = await this.findRoleById(dto.id);
    if (!role) {
      throw new BusinessException('该角色不存在');
    }
    /** 保存角色可访问的菜单 */
    const menus = await this.menuService.getMenuByKey(dto.menus);
    const saveRole = this.roleRepository.create({ ...role, menus });
    await this.roleRepository.save(saveRole);
    /** 删除已存在的权限 */
    await this.roleMenuPermissionRepository
      .createQueryBuilder('rpm')
      .delete()
      .where('role_id=:roleId', { roleId: role.id })
      .execute();
    /** 保存新的权限 */
    const { permissions } = dto;
    const arr: [string, string][] = [];
    const menuKeyArr: string[] = [];
    const prmKeyArr: string[] = [];
    Object.keys(permissions).forEach((menuKey) => {
      if (!menuKeyArr.includes(menuKey)) menuKeyArr.push(menuKey);
      permissions[menuKey].forEach((prmKey) => {
        if (!prmKeyArr.includes(prmKey)) prmKeyArr.push(prmKey);
        arr.push([menuKey, prmKey]);
      });
    });
    const ms = await this.menuRepository.find({ where: { key: In(menuKeyArr) } });
    const ps = await this.permissionRepository.find({ where: { key: In(prmKeyArr) } });
    const msMap: Record<string, Menu> = {};
    const psMap: Record<string, Permission> = {};
    ms.forEach((menu) => {
      msMap[menu.key] = menu;
    });
    ps.forEach((permission) => {
      psMap[permission.key] = permission;
    });
    const rmps: RoleMenuPermission[] = [];
    arr.forEach(([menuKey, prmKey]) => {
      if (msMap[menuKey] && psMap[prmKey]) {
        const rmp = this.roleMenuPermissionRepository.create({
          role,
          menu: msMap[menuKey],
          permission: psMap[prmKey],
        });
        rmps.push(rmp);
      }
    });
    await this.roleMenuPermissionRepository.save(rmps);
  }

  /**
   * 根据角色，获取操作权限
   * @param roleIds 角色 id 列表
   * @returns 权限
   */
  async getPermissionByRoleIds(roleIds: number[]) {
    const rmps = await this.roleMenuPermissionRepository
      .createQueryBuilder('rmp')
      .leftJoinAndSelect('rmp.menu', 'menu')
      .leftJoinAndSelect('rmp.permission', 'permission')
      .where('rmp.role_id IN (:...roleIds)', { roleIds })
      .getMany();
    return rmps;
  }

  /**
   * 根据 id 获取角色
   * @param id 角色 id
   * @returns 角色
   */
  async findRoleById(id: number) {
    return await this.roleRepository.findOne({ where: { id } });
  }
}

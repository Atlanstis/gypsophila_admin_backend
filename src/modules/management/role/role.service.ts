import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  In,
  Not,
  Repository,
} from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BusinessException, CommonPageDto } from 'src/core';
import { Menu, Role, RoleMenuPermission } from 'src/entities';
import {
  execSingleStrategy,
  findOneBy,
  getSkipTake,
  Key_RoleMenu,
  Key_RolePermission,
  transformStringArray2Set,
  useTransaction,
} from 'src/utils';
import { RedisService } from 'src/modules';
import { EnumMenuKey } from 'src/constants';
import { aggregateMenuPermissions } from './helper';
import { RoleIdEnum } from './constants';
import { RMPEditDto, RoleAddDto, RoleEditDto } from './dto';
import { MenuService } from '../menu/menu.service';
import { MenuPermissionService } from '../menu/menu-permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(RoleMenuPermission)
    private readonly rmpRepo: Repository<RoleMenuPermission>,
    private readonly menuService: MenuService,
    private readonly mpService: MenuPermissionService,
    private dataSource: DataSource,
    private redisService: RedisService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /**
   * 获取角色列表
   * @param page 页码
   * @param size 条数
   * @returns 角色列表
   */
  async list(
    dto: CommonPageDto,
    payload: App.JwtPayload,
  ): Promise<ResCommon.TableData<ResRole.RoleListData>> {
    // 计算跳过的记录数和获取的记录数
    const { page, size } = dto;
    const { skip, take } = getSkipTake(page, size);
    const [roles, total] = await this.roleRepo.findAndCount({
      skip,
      take,
      order: {
        id: 'ASC',
      },
    });

    // 获取当前用户的权限
    const permission = await this.getPermission(payload.roleIds);

    // 格式化用户列表，添加权限信息
    const formattedRoles = roles.map((role) => {
      // 编辑权限的策略
      const editStrategies = [
        // 是否拥有编辑权限
        () => permission.edit,
        // 内置角色无法编辑
        () => role.isBuiltin === 0,
      ];

      // 删除权限的策略
      const deleteStrategies = [
        // 是否拥有删除权限
        () => permission.delete,
        // 内置角色无法删除
        () => role.isBuiltin === 0,
      ];

      // 权限设置的策略
      const permissionStrategies = [
        // 是否拥有权限设置权限
        () => permission.permissionSet,
        // 非超级管理员不能设置超级管理员的权限
        // 非超级管理员不能设置自身拥有的角色的权限
        () => {
          if (role.id === RoleIdEnum.Admin) {
            return payload.roleIds.includes(RoleIdEnum.Admin);
          } else {
            return !payload.roleIds.includes(role.id);
          }
        },
      ];

      return {
        ...role,
        permission: {
          edit: execSingleStrategy(editStrategies),
          delete: execSingleStrategy(deleteStrategies),
          permissionSet: execSingleStrategy(permissionStrategies),
        },
      };
    });

    return { list: formattedRoles, total };
  }

  /**
   * 新增角色
   * @param dto 角色信息
   */
  async add(dto: RoleAddDto) {
    await findOneBy(
      this.dataSource,
      Role,
      { name: dto.name },
      (role) => !!role,
      '当前角色名已存在',
    );
    const newRole = this.roleRepo.create({ ...dto });
    await this.roleRepo.save(newRole);
  }

  /**
   * 编辑角色
   * @param dto 角色信息
   */
  async edit(dto: RoleEditDto) {
    await findOneBy(
      this.dataSource,
      Role,
      { id: dto.id },
      (role) => !role,
      '当前角色不存在',
    );
    const updateRole = this.roleRepo.create(dto);
    await this.roleRepo.update({ id: dto.id }, updateRole);
  }

  /**
   * 删除角色
   * @param id 角色 id
   */
  async delete(id: number) {
    const role = await findOneBy(
      this.dataSource,
      Role,
      { id },
      (role) => !role,
      '角色不存在',
      { users: true },
    );
    if (role.isBuiltin) {
      throw new BusinessException('内置角色不能删除');
    }
    if (role.users.length) {
      throw new BusinessException('当前角色已被用户关联，无法删除');
    }
    await this.roleRepo.delete({ id });
  }

  /**
   * 获取可以分配的角色
   * @returns 除超级管理员外的角色
   */
  async assignable(): Promise<ResRole.Role[]> {
    return await this.roleRepo.find({
      where: { id: Not(RoleIdEnum.Admin) },
    });
  }

  /**
   * 获取角色管理页面相关配置
   * @param roleIds 角色 id 列表
   */
  async getPageConfig(roleIds: number[]): Promise<ResRole.Config> {
    const permission = await this.getPermission(roleIds);

    return {
      permission,
    };
  }

  /** 获取当前角色下，角色管理页面的权限映射 */
  async getPermission(roleIds: number[]) {
    const key = EnumMenuKey.ManagementRole;
    return this.getRoleMenuPermissionMap<ResRole.ConfigPermission>(
      roleIds,
      key,
    );
  }

  /**
   * 获取该角色下可以访问的菜单及权限
   * @param id 角色 id
   * @returns 授权菜单及权限
   */
  async menuPermission(id: number) {
    /** 获取该角色下可访问的菜单 */
    const role = await findOneBy(
      this.dataSource,
      Role,
      { id },
      (role) => !role,
      '该角色不存在',
      { menus: true },
    );

    /** 获取该角色拥有的权限 */
    const rmps = await this.rmpRepo.findBy({ roleId: id });
    const mps = aggregateMenuPermissions(rmps, role.menus);

    /** 获取所有菜单及下面的菜单 */
    const list = await this.menuService.getMenus();

    return {
      list,
      mps,
    };
  }

  /**
   * 编辑该角色下可以访问的菜单
   */
  async menuPermissionEdit(dto: RMPEditDto) {
    const { mps, id } = dto;
    // 查找当前角色
    const role = await findOneBy(
      this.dataSource,
      Role,
      { id },
      (role) => !role,
      '当前角色不存在',
    );

    const menuIds = mps.map((item) => item.menuId);
    const menus = await this.menuRepo.find({
      where: { id: In(menuIds) },
      relations: { permissions: true },
    });

    const allRMPs = await this.rmpRepo.find({ where: { roleId: id } });

    const newRMPs: RoleMenuPermission[] = [];
    const deletedRMPs: RoleMenuPermission[] = [];
    for (const { menuId, permissionIds } of mps) {
      // 判断是否存在此菜单
      const menu = menus.find((menu) => menu.id === menuId);
      if (!menu) {
        continue;
      }
      // 查找当前菜单所有权限的 id
      const menuPermissionIds = menu.permissions.map(
        (permission) => permission.id,
      );
      // 查找当前角色在此菜单下已分配的 RMP
      const existingRMPs = allRMPs.filter((rmp) => rmp.menuId === menu.id);
      // 已分配 RMP id
      const existingRMPIds = existingRMPs.map((rmp) => rmp.permissionId);
      // 默认都删除
      const needDeleteRMPIds = existingRMPs.map((rmp) => rmp.id);

      for (const permissionId of permissionIds) {
        // 传过来的权限 id 包含在当前菜单权限下
        if (menuPermissionIds.includes(permissionId)) {
          // 存在，从默认删除中移除
          if (existingRMPIds.includes(permissionId)) {
            const rmp = existingRMPs.find(
              (item) => item.permissionId === permissionId,
            );
            if (rmp) {
              const index = needDeleteRMPIds.indexOf(rmp.id);
              if (index > -1) {
                needDeleteRMPIds.splice(index, 1);
              }
            }
          } else {
            // 新增 RMP
            const newRMP = this.rmpRepo.create({
              role: role,
              menu: menu,
              permission: { id: permissionId },
            });
            newRMPs.push(newRMP);
          }
        }
      }
      const needDeleteRMPs = existingRMPs.filter((rmp) =>
        needDeleteRMPIds.includes(rmp.id),
      );
      deletedRMPs.push(...needDeleteRMPs);
    }
    // 执行，新增或删除操作
    const inTransaction = async (manager: EntityManager) => {
      await manager.save(newRMPs);
      await manager.remove(deletedRMPs);
      role.menus = menus;
      await manager.save(role);
    };
    await useTransaction(this.dataSource, inTransaction);
    // 更新缓存
    await this.loadRM2Redis(id);
    await this.loadRMPs2Redis(id);
  }

  /**
   * 获取角色菜单权限映射。
   * @param roleIds - 角色ID数组。
   * @param key - 权限菜单的键。
   * @returns 一个包含角色菜单权限映射的对象。
   */
  async getRoleMenuPermissionMap<T>(roleIds: number[], key: string) {
    // 获取权限列表
    const permissions = await this.mpService.getPermissionList({ key });
    // 获取角色权限
    const rolePermissionSet = await this.getRolePermissionsFromRedis(roleIds);
    const map: any = {};
    permissions.forEach((item) => {
      map[item.alias] = rolePermissionSet.has(item.key);
    });
    return map as T;
  }

  /**
   * 从 Redis 中获取角色的权限集合。
   * @param roleIds - 角色ID数组。
   * @returns 一个包含所有角色权限的集合。
   */
  async getRolePermissionsFromRedis(roleIds: number[]) {
    // 获取每个角色的权限
    const result = (
      await Promise.all(
        roleIds.map((roleId) =>
          this.redisService.getHash(Key_RolePermission, String(roleId)),
        ),
      )
    ).filter((item): item is string => item !== undefined);
    return transformStringArray2Set(result);
  }

  /**
   * 从 Redis 中获取角色的菜单集合。
   * @param roleIds - 角色ID数组。
   * @returns 一个包含所有角色菜单的集合。
   */
  async getRoleMenusFromRedis(roleIds: number[]) {
    // 获取每个角色的拥有的菜单
    const result = (
      await Promise.all(
        roleIds.map((roleId) =>
          this.redisService.getHash(Key_RoleMenu, String(roleId)),
        ),
      )
    ).filter((item): item is string => item !== undefined);
    return transformStringArray2Set(result);
  }

  /** 获取角色的菜单，并加载进 redis */
  async loadRM2Redis(roleId?: number) {
    this.logger.log('Load role menus --> start');
    const where: FindOptionsWhere<Role> = roleId ? { id: roleId } : {};
    const rms = await this.roleRepo.find({ where, relations: { menus: true } });
    const fieldsValues: [string, string][] = [];
    for (const { id, menus } of rms) {
      fieldsValues.push([
        String(id),
        JSON.stringify(menus.map((menu) => menu.key)),
      ]);
    }
    await this.redisService.setHashes(Key_RoleMenu, fieldsValues);
    this.logger.log('Load role menus --> success');
  }

  /** 获取各角色的权限，并加载进 redis */
  async loadRMPs2Redis(roleId?: number) {
    this.logger.log('Load role permissions --> start');
    const where: FindOptionsWhere<RoleMenuPermission> = roleId
      ? { roleId: roleId }
      : {};
    const rmps = await this.rmpRepo.find({
      where,
      relations: { permission: true },
    });
    const map = new Map<number, Set<string>>();
    for (const { roleId, permission } of rmps) {
      let rolePermissions = map.get(roleId);
      if (!rolePermissions) {
        map.set(roleId, (rolePermissions = new Set<string>()));
      }
      if (permission && !rolePermissions.has(permission.key)) {
        rolePermissions.add(permission.key);
      }
    }
    const fieldsValues: [string, string][] = [];
    for (const [roleId, permissions] of map.entries()) {
      fieldsValues.push([
        String(roleId),
        JSON.stringify(Array.from(permissions)),
      ]);
    }
    await this.redisService.setHashes(Key_RolePermission, fieldsValues);
    this.logger.log('Load role permissions --> success');
  }
}

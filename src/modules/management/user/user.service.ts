import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { And, DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { BusinessException, CommonPageDto } from 'src/core';
import { User, UserAuthMethod, AuthMethodTypeEnum, Role } from 'src/entities';
import {
  areArraysEqualUnordered,
  execSingleStrategy,
  findOneByExistError,
  findOneByNotExistError,
  getJwtRedisKey,
  getSkipTake,
  hybridDecrypt,
  useTransaction,
} from 'src/utils';
import { UserAddDto, UserEditDto } from './dto';
import { RoleIdEnum } from '../role/constants';
import { EnumMenuKey } from 'src/constants';
import { RoleService } from '../role/role.service';
import { RedisService } from 'src/modules/auxiliary';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly roleService: RoleService,
    private readonly redisService: RedisService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 获取用户列表。
   * @param dto - 包含分页信息的对象。
   * @param payload - 包含 JWT 负载信息的对象。
   * @returns 一个包含用户列表和总数的对象。
   */
  async list(
    dto: CommonPageDto,
    payload: App.JwtPayload,
  ): Promise<ResCommon.TableData<ResUser.UserListData>> {
    // 计算跳过的记录数和获取的记录数
    const { page, size } = dto;
    const { skip, take } = getSkipTake(page, size);

    // 从数据库中获取用户列表和总数，包括关联的角色信息
    const [users, total] = await this.userRepo.findAndCount({
      skip,
      take,
      relations: { roles: true },
      order: { createTime: 'ASC' },
    });

    // 获取当前用户的权限
    const permission = await this.getPermission(payload.roleIds);

    // 格式化用户列表，添加权限信息
    const formattedUsers = users.map((user) => {
      // 编辑权限的策略
      const editStrategies = [
        // 是否拥有编辑权限
        () => permission.edit,
      ];

      // 删除权限的策略
      const deleteStrategies = [
        // 是否拥有删除权限
        () => permission.delete,
        // 无法删除拥有超级管理员角色的用户
        () => !user.roles.some((role) => role.id === RoleIdEnum.Admin),
        // 无法删除自己
        () => user.id !== payload.id,
      ];

      return {
        ...user,
        permission: {
          edit: execSingleStrategy(editStrategies),
          delete: execSingleStrategy(deleteStrategies),
        },
      };
    });

    return { list: formattedUsers, total };
  }

  /**
   * 新增用户
   * @param dto 用户信息
   */
  async add(dto: UserAddDto) {
    await findOneByExistError(
      this.dataSource,
      User,
      { username: dto.username },
      '该用户名已存在，请更换后重试',
    );
    const inTransaction = async (manager: EntityManager) => {
      const roles = await this.judgeRoleValid(dto.roleIds);
      const user = manager.create(User, {
        username: dto.username,
        nickname: dto.nickname,
        roles,
      });

      await manager.save(user);

      const password = hybridDecrypt(
        dto.password.data,
        dto.password.key,
        dto.password.iv,
      );

      const encryptedPassword = await argon.hash(password);

      const authMethod = manager.create(UserAuthMethod, {
        methodType: AuthMethodTypeEnum.password,
        password: encryptedPassword,
        user,
      });

      await manager.save(authMethod);
    };
    await useTransaction(this.dataSource, inTransaction);
  }

  /**
   * 编辑用户信息
   * @param {UserEditDto} dto - 用户编辑数据
   * @param {App.JwtPayload} payload - jwt 数据
   */
  async edit(dto: UserEditDto, payload: App.JwtPayload) {
    // 查找用户及其角色信息
    const user = await findOneByNotExistError(
      this.dataSource,
      User,
      { id: dto.id },
      '该用户不存在，请更换后重试',
      { roles: true },
    );
    // 获取用户的角色ID列表
    let roles = user.roles;
    const beforeRoleIds = roles.map((role) => role.id);
    // 不包含超级管理员，则更新角色信息
    // 同时不能更新自身角色信息
    if (!beforeRoleIds.includes(RoleIdEnum.Admin) && payload.id !== dto.id) {
      roles = await this.judgeRoleValid(dto.roleIds);
    }
    // 用户角色信息发生变化，则删除其 accessToken
    const afterRoleIds = roles.map((role) => role.id);
    if (!areArraysEqualUnordered(beforeRoleIds, afterRoleIds)) {
      await this.redisService.del(getJwtRedisKey(dto.id, 'access'));
    }
    // 更新用户
    const newUser = this.userRepo.create({
      ...user,
      ...dto,
      roles,
    });
    await this.userRepo.save(newUser);
  }

  /**
   * 判断角色的有效性
   * @param role 角色 ids
   * @description 根据传入的 id 列表，查询角色数据是否存在，同时排除超级管理员角色
   */
  async judgeRoleValid(roleIds: number[]) {
    const roles = await this.roleRepo.findBy({
      id: And(In(roleIds), Not(RoleIdEnum.Admin)),
    });
    if (!roles.length) {
      throw new BusinessException('无效的角色，请重新选择');
    }
    return roles;
  }

  /**
   * 删除用户
   * @param id 用户 ID
   * @param userId 操作用户 ID
   */
  async delete(id: string, userId: string) {
    // 查找用户及其角色信息
    const user = await findOneByNotExistError(
      this.dataSource,
      User,
      { id: id },
      '该用户不存在，请更换后重试',
      { roles: true },
    );
    // 无法删除自己
    if (user.id === userId) {
      throw new BusinessException('无法删除自己');
    }
    // 拥有超级管理员角色的用户无法删除
    if (user.roles.find((item) => item.id === RoleIdEnum.Admin)) {
      throw new BusinessException('拥有超级管理员角色的用户无法删除');
    }
    await this.userRepo.delete({ id });
    // 删除用户后，同时删除其 accessToken 及 refreshToken
    await this.redisService.del(getJwtRedisKey(id, 'access'));
    await this.redisService.del(getJwtRedisKey(id, 'refresh'));
  }

  /**
   * 获取用户管理页面相关配置
   * @param roleIds 角色 id 列表
   */
  async getPageConfig(roleIds: number[]): Promise<ResUser.Config> {
    const permission = await this.getPermission(roleIds);

    return {
      permission,
    };
  }

  async getPermission(roleIds: number[]) {
    const key = EnumMenuKey.ManagementUser;
    return this.roleService.getRoleMenuPermissionMap<ResUser.ConfigPermission>(
      roleIds,
      key,
    );
  }
}

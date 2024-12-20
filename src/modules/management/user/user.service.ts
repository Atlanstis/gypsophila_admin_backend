import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { User, UserAuthMethod, AuthMethodTypeEnum, Role } from 'src/entities';
import { And, DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { BusinessException } from 'src/core';
import { RoleService } from 'src/modules/management/role/role.service';
import { findOneBy, hybridDecrypt, useTransaction } from 'src/utils';
import { RoleIdEnum } from '../role/constants';
import { UserAddDto, UserEditDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly roleService: RoleService,
    private dataSource: DataSource,
  ) {}

  /**
   * 根据页码跟长度获取用户列表
   * @param page 页码
   * @param size 长度
   * @returns 用户列表
   */
  async list(page: number, size: number) {
    const [list, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      relations: { roles: true },
      order: {
        createTime: 'ASC',
      },
    });
    return { list, total };
  }

  /**
   * 新增用户
   * @param dto 用户信息
   */
  async add(dto: UserAddDto) {
    await findOneBy(
      this.dataSource,
      User,
      { username: dto.username },
      (user) => !!user,
      '该用户名已存在，请更换后重试',
    );
    const inTransaction = async (manager: EntityManager) => {
      const roles = await this.judgeRoleValid(dto.role);
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
   * 编辑用户
   * @param dto 用户信息
   */
  async edit(dto: UserEditDto) {
    const user = await findOneBy(
      this.dataSource,
      User,
      { id: dto.id },
      (user) => !user,
      '该用户不存在，请更换后重试',
      { roles: true },
    );
    let roles = user.roles;
    const roleIds = roles.map((item) => item.id);
    // 不包含超级管理员，则更新角色信息
    if (!roleIds.includes(RoleIdEnum.Admin)) {
      roles = await this.judgeRoleValid(dto.role);
    }
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
   * @param id 用户 id
   */
  async delete(id: string, userId: string) {
    const user = await findOneBy(
      this.dataSource,
      User,
      { id: id },
      (user) => !user,
      '该用户不存在，请更换后重试',
      { roles: true },
    );
    // 不能删除自己
    if (user.id === userId) {
      throw new BusinessException('无法删除自己');
    }
    // 拥有超级管理员角色的用户无法删除
    if (user.roles.find((item) => item.id === RoleIdEnum.Admin)) {
      throw new BusinessException('拥有超级管理员角色的用户无法删除');
    }
    await this.userRepo.delete({ id });
  }
}

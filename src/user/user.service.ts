import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { User } from 'src/entities';
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UserAddDto, UserEditDto } from './dto';
import { BusinessException } from 'src/core';
import { RoleService } from 'src/role/role.service';
import { handleRoleJudge } from './helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  /**
   * 根据页码跟长度获取用户列表
   * @param page 页码
   * @param size 长度
   * @returns 用户列表
   */
  async list(page: number, size: number) {
    const [list, total] = await this.userRepository.findAndCount({
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
    const existedUser = await this.findOneByUser({ username: dto.username });
    if (existedUser) {
      throw new BusinessException('该用户名已存在');
    }
    const role = await handleRoleJudge(this.roleService, dto.role, '此角色不允许添加');
    dto.password = await argon.hash(dto.password);
    const newUser = this.userRepository.create({ ...dto, roles: [role] });
    await this.userRepository.save(newUser);
  }

  /**
   * 编辑用户
   * @param dto 用户信息
   */
  async edit(dto: UserEditDto) {
    const existedUser = await this.findOneByUser({ id: dto.id }, {}, { roles: true });
    if (!existedUser) {
      throw new BusinessException('该用户不存在');
    }
    // 用户名不可编辑
    if (existedUser.username !== dto.username) {
      throw new BusinessException('用户名不可编辑');
    }
    const role = await handleRoleJudge(this.roleService, dto.role, '不允许修改为此角色');
    const newUser = this.userRepository.create({ ...existedUser, ...dto, roles: [role] });
    await this.userRepository.save(newUser);
  }

  /**
   * 删除用户
   * @param id 用户 id
   */
  async delete(id: string) {
    const existedUser = await this.findOneByUser({ id: id });
    if (!existedUser) {
      throw new BusinessException('该用户不存在');
    }
    await this.userRepository.delete({ id });
    return null;
  }

  /**
   * 查找用户信息
   * @param user 用户查询条件
   * @returns 用户信息
   */
  async findOneByUser(
    user: FindOptionsWhere<User>,
    select: FindOptionsSelect<User> = {},
    relations: FindOptionsRelations<User> = {},
  ) {
    const findOpt: FindOneOptions<User> = { where: { ...user } };
    if (Object.keys(select).length > 0) {
      findOpt.select = select;
    }
    if (Object.keys(relations).length > 0) {
      findOpt.relations = relations;
    }
    return await this.userRepository.findOne(findOpt);
  }
}

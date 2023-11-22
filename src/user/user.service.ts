import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 根据页码跟长度获取用户列表
   * @param page 页码
   * @param size 长度
   * @returns 用户列表
   */
  async list(page: number, size: number) {
    return await this.userRepository.find({
      skip: (page - 1) * size,
      take: size,
      relations: { roles: true },
    });
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

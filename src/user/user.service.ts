import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 根据用户名查找用户信息
   * @param username 用户名
   * @returns 用户信息
   */
  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }
}

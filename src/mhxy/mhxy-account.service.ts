import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MHXY_ACCOUNT_ROLE_OPTS, MHXY_ACCOUNT_SECT_OPTS } from 'src/constants';
import { BusinessException, CommonPageDto } from 'src/core';
import { MhxyAccount } from 'src/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MhxyAccountDto, MhxyAccountEditDto, MhxyAccountIdDto } from './dto';
import { UserService } from '../user/user.service';

@Injectable()
/** 梦幻账号相关服务 */
export class MhxyAccountService {
  constructor(
    @InjectRepository(MhxyAccount)
    private readonly mhxyAccountRepository: Repository<MhxyAccount>,
    private readonly userService: UserService,
  ) {}

  /** 查询账号列表 */
  async accountList(dto: CommonPageDto, userId: string) {
    const { page, size } = dto;
    const [list, total] = await this.mhxyAccountRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        user: {
          id: userId,
        },
      },
    });
    return { list, total };
  }

  /** 获取当前用户下所有梦幻账号数据 */
  async accountAll(userId: string) {
    return this.mhxyAccountRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  /** 新增账号数据 */
  async accountAdd(dto: MhxyAccountDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    if (!user) {
      throw new BusinessException('当前用户不存在');
    }
    const mhxyAccount = this.mhxyAccountRepository.create({ ...dto, user });
    await this.mhxyAccountRepository.save(mhxyAccount);
  }

  /** 编辑账号数据 */
  async accountEdit(dto: MhxyAccountEditDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    if (!user) {
      throw new BusinessException('当前用户不存在');
    }
    const mhxyAccount = await this.findAccount({ id: dto.id, user: { id: userId } });
    if (!mhxyAccount) {
      throw new BusinessException('当前账号不存在');
    }
    const newAccount = this.mhxyAccountRepository.create({ ...mhxyAccount, ...dto });
    await this.mhxyAccountRepository.save(newAccount);
  }

  /** 删除账号数据 */
  async accountDelete(id: MhxyAccountIdDto['id'], userId: string) {
    const mhxyAccount = await this.findAccount({ id: id, user: { id: userId } });
    if (!mhxyAccount) {
      throw new BusinessException('当前账号不存在');
    }
    await this.mhxyAccountRepository.remove(mhxyAccount);
  }

  /** 获取角色数据 */
  async accountRole() {
    return MHXY_ACCOUNT_ROLE_OPTS;
  }

  /** 获取门派数据 */
  async accountSect() {
    return MHXY_ACCOUNT_SECT_OPTS;
  }

  /** 查找账号 */
  async findAccount(where: FindOptionsWhere<MhxyAccount>) {
    return await this.mhxyAccountRepository.findOne({ where });
  }
}

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MHXY_ACCOUNT_ROLE_OPTS,
  MHXY_ACCOUNT_SECT_OPTS,
  ENUM_MHXY_ACCOUNT_STATUS,
} from 'src/constants';
import { BusinessException, CommonPageDto } from 'src/core';
import { MhxyAccount, MhxyAccountGroup, MhxyAccountGroupItem, MhxyChannel } from 'src/entities';
import {
  DataSource,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { MhxyAccountDto, MhxyAccountEditDto, MhxyAccountIdDto } from './dto';
import { UserService } from '../user/user.service';
import { useTransaction } from 'src/utils';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';
import {
  MHXY_CHANNEL_DEFAULT_KEY,
  MHXY_GOLD_RECORD_STATUS,
  MHXY_GOLD_RECORD_TYPE,
} from './constants';

@Injectable()
/** 梦幻账号相关服务 */
export class MhxyAccountService {
  constructor(
    @InjectRepository(MhxyAccount)
    private readonly mhxyAccountRepository: Repository<MhxyAccount>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => MhxyAccountGoldRecordService))
    private readonly goldRecordService: MhxyAccountGoldRecordService,
    private readonly dataSource: DataSource,
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
      relations: {
        groupItem: {
          group: true,
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

    const inTransaction = async (manager: EntityManager) => {
      const account = this.mhxyAccountRepository.create({ ...dto, user });
      await manager.save(account);
      // 处理分组信息
      if (dto.groupId) {
        const group = await manager.findOne(MhxyAccountGroup, {
          where: { id: dto.groupId, user: { id: userId } },
        });
        if (!group) {
          throw new BusinessException('分组不存在');
        }
        // 新增分组项信息
        const groupItem = manager.create(MhxyAccountGroupItem, {
          group,
          account,
          remark: dto.groupRemark,
        });
        await manager.save(groupItem);
      }
    };
    await useTransaction(this.dataSource, inTransaction);
  }

  /** 编辑账号数据 */
  async accountEdit(dto: MhxyAccountEditDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    if (!user) {
      throw new BusinessException('当前用户不存在');
    }
    const account = await this.findAccount(
      { id: dto.id, user: { id: userId } },
      { groupItem: true },
    );
    if (!account) {
      throw new BusinessException('当前账号不存在');
    }
    const inTransaction = async (manager: EntityManager) => {
      if (dto.status === ENUM_MHXY_ACCOUNT_STATUS.BANNED || !dto.groupId) {
        // 编辑后无分组，或者账号被封禁，去除所在分组
        if (account.groupItem) {
          // 编辑前有分组，删除分组信息
          await manager.delete(MhxyAccountGroupItem, { id: account.groupItem.id });
        }
      } else if (dto.groupId) {
        // 编辑后有分组，新增或更新分组信息
        const group = await manager.findOne(MhxyAccountGroup, {
          where: { id: dto.groupId, user: { id: userId } },
        });
        if (!group) {
          throw new BusinessException('分组不存在');
        }
        // 保存分组信息
        const groupItem = manager.create(MhxyAccountGroupItem, {
          id: account.groupItem ? account.groupItem.id : undefined,
          account,
          group,
          remark: dto.groupRemark,
        });
        await manager.save(groupItem);
        account.groupItem = groupItem;
      }
      const newAccount = manager.create(MhxyAccount, {
        ...account,
        ...dto,
      });
      await manager.save(newAccount);
      if (dto.status === ENUM_MHXY_ACCOUNT_STATUS.BANNED) {
        const channel = await manager.findOne(MhxyChannel, {
          where: {
            key: MHXY_CHANNEL_DEFAULT_KEY.GOLD_DEDUCT,
          },
        });
        if (!channel) {
          throw new BusinessException('金币扣除途径不存在，请检查数据库');
        }
        // 去除被锁金币
        account.lockGold = 0;
        // 创建金币记录，记录金币清零
        await this.goldRecordService.createGoldRecord(
          manager,
          account,
          user,
          channel,
          null,
          account.gold,
          MHXY_GOLD_RECORD_TYPE.EXPENDITURE,
          MHXY_GOLD_RECORD_STATUS.COMPLETE,
          0,
          '',
          null,
        );
      }
    };
    await useTransaction(this.dataSource, inTransaction);
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
  async findAccount(
    where: FindOptionsWhere<MhxyAccount>,
    relations?: FindOptionsRelations<MhxyAccount>,
  ) {
    return await this.mhxyAccountRepository.findOne({ where, relations });
  }
}

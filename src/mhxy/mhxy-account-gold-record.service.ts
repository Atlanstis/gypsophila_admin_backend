import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { BusinessException, CommonPageDto } from 'src/core';
import {
  MhxyAccount,
  MhxyAccountGoldRecord,
  MhxyAccountGoldTransfer,
  MhxyChannel,
  MhxyPropCategory,
  User,
} from 'src/entities';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { MhxyAccountService } from './mhxy-account.service';
import { GoldRecordAddDto, GoldRecordCompleteDto, GoldRecordIdDto } from './dto';
import {
  MHXY_CHANNEL_DEFAULT_KEY,
  MHXY_GOLD_RECORD_AMOUNT_TYPE,
  MHXY_GOLD_RECORD_COMPLETE_STATUS,
  MHXY_GOLD_RECORD_STATUS,
  MHXY_GOLD_RECORD_TYPE,
} from './constants';
import { MHXY_TRADE_TAX } from 'src/constants';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
/** 金币收支记录相关服务 */
export class MhxyAccountGoldRecordService {
  constructor(
    @InjectRepository(MhxyAccountGoldRecord)
    private readonly goldRecordRepository: Repository<MhxyAccountGoldRecord>,
    @InjectRepository(MhxyChannel)
    private readonly channelRepository: Repository<MhxyChannel>,
    @InjectRepository(MhxyPropCategory)
    private readonly propCategoryRepository: Repository<MhxyPropCategory>,
    private readonly settingService: SettingService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => MhxyAccountService))
    private readonly mhxyAccountService: MhxyAccountService,
    private dataSource: DataSource,
  ) {}

  /** 获取当前用户下，梦幻账号的金币收支记录 */
  async goldRecordList(dto: CommonPageDto, userId: string) {
    const { page, size } = dto;
    const [list, total] = await this.goldRecordRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        account: true,
        propCategory: true,
        channel: true,
      },
    });
    return { list, total };
  }

  /** 新增收支记录 */
  async goldRecordAdd(dto: GoldRecordAddDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const account = await this.mhxyAccountService.findAccount({
      id: dto.accountId,
      user: {
        id: userId,
      },
    });
    if (!account) {
      throw new BusinessException('当前账号不存在，请重新选择');
    }
    const channel = await this.channelRepository.findOne({
      where: {
        id: dto.channelId,
      },
    });
    if (!channel) {
      throw new BusinessException('当前途径不存在，请重新选择');
    }
    let propCategory: MhxyPropCategory;
    if (dto.propCategoryId) {
      propCategory = await this.propCategoryRepository.findOne({
        where: { id: dto.propCategoryId },
      });
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      if (dto.amountType === MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT) {
        // 按账号当前金币数计算收支
        const diff = dto.nowAmount - account.gold;
        if (channel.key === MHXY_CHANNEL_DEFAULT_KEY.MANUAL_CALIBRATION) {
          if (diff === 0 && dto.nowLockAmount === account.lockGold) {
            throw new BusinessException('当前账号金币余额未发生变化');
          } else if (diff === 0) {
            // 金币未发生变化，直接更新被锁金币数，不插入金币记录
            await queryRunner.manager.update(MhxyAccount, account.id, {
              lockGold: dto.nowLockAmount,
            });
            await queryRunner.commitTransaction();
            return;
          } else {
            account.lockGold = dto.nowLockAmount;
          }
        } else if (diff === 0) {
          throw new BusinessException('当前账号金币余额未发生变化');
        }
        const amount = Math.abs(diff);
        const type = diff > 0 ? MHXY_GOLD_RECORD_TYPE.REVENUE : MHXY_GOLD_RECORD_TYPE.EXPENDITURE;
        await this.createGoldRecord(
          queryRunner.manager,
          account,
          user,
          channel,
          propCategory,
          amount,
          type,
          dto.status,
          dto.nowAmount,
          dto.remark,
        );
      } else if (dto.amountType === MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT) {
        // 按涉及金额计算收支
        const accountNowGold =
          dto.type === MHXY_GOLD_RECORD_TYPE.REVENUE
            ? account.gold + dto.amount
            : account.gold - dto.amount;
        await this.createGoldRecord(
          queryRunner.manager,
          account,
          user,
          channel,
          propCategory,
          dto.amount,
          dto.type,
          dto.status,
          accountNowGold,
          dto.remark,
        );
      }
      // 提交事务
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /** 查询单条收支记录 */
  async goldRecordInfo(dto: GoldRecordIdDto, userId: string) {
    const record = await this.goldRecordRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        account: true,
        propCategory: true,
        channel: true,
      },
    });
    if (!record) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    let realAmount = record.amount;
    if (
      record.channel.key === MHXY_CHANNEL_DEFAULT_KEY.TRADE &&
      record.type === MHXY_GOLD_RECORD_TYPE.REVENUE
    ) {
      // 途径为交易的情况下，获得收入时会被收税
      const tax = await this.settingService.getSettingByKey(MHXY_TRADE_TAX, [
        [(tax) => !tax, '请先设置 MHXY_TRADE_TAX'],
        [(tax) => isNaN(Number(tax.value)), 'MHXY_TRADE_TAX 设置错误'],
      ]);
      realAmount = Number(
        new BigNumber(record.amount * (100 - Number(tax.value)) * 0.01).toFixed(0),
      );
    }
    return { ...record, realAmount };
  }

  /** 撤销收支记录 */
  async goldRecordRevert(dto: GoldRecordIdDto, userId: string) {
    const record = await this.goldRecordRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        account: true,
        transfer: true,
      },
    });
    if (!record) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      if (record.transfer) {
        // 通过转金途径生成的记录无法撤销
        throw new BusinessException('当前记录无法撤销，请在转金中进行撤销');
      }
      if (record.status === MHXY_GOLD_RECORD_STATUS.COMPLETE) {
        // 如果是已完成状态，根据收入或支出，修改金额
        const acount = record.account;
        let amount = acount.gold;
        if (record.type === MHXY_GOLD_RECORD_TYPE.REVENUE) {
          amount = acount.gold - record.amount;
        } else if (record.type === MHXY_GOLD_RECORD_TYPE.EXPENDITURE) {
          amount = acount.gold + record.amount;
        }
        await queryRunner.manager.update(MhxyAccount, acount.id, {
          gold: amount,
        });
      }
      // 删除记录
      await queryRunner.manager.delete(MhxyAccountGoldRecord, record.id);
      // 提交事务
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /** 处理未完成的收支记录 */
  async goldRecordComplete(dto: GoldRecordCompleteDto, userId: string) {
    const record = await this.goldRecordRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        account: true,
      },
    });
    if (!record) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      if (dto.status === MHXY_GOLD_RECORD_COMPLETE_STATUS.COMPLETE) {
        // 完成，更新金额及账号金币数
        await queryRunner.manager.update(MhxyAccountGoldRecord, record.id, {
          amount: dto.realAmount,
          status: MHXY_GOLD_RECORD_STATUS.COMPLETE,
        });
        await queryRunner.manager.update(MhxyAccount, record.account.id, {
          gold:
            record.type === MHXY_GOLD_RECORD_TYPE.EXPENDITURE
              ? record.account.gold - dto.realAmount
              : record.account.gold + dto.realAmount,
        });
      } else {
        // 撤销，删除记录
        await queryRunner.manager.delete(MhxyAccountGoldRecord, record.id);
      }
      // 提交事务
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 创建金币收支记录，并更新账号金币数
   * @param manager EntityManager
   * @param account 账号
   * @param user 归属用户
   * @param channel 途径
   * @param propCategory 道具种类
   * @param amount 金额
   * @param type 收入/支出
   * @param status 状态
   * @param accountNowGold 用户金币数
   * @param remark 备注
   */
  async createGoldRecord(
    manager: EntityManager,
    account: MhxyAccount,
    user: User,
    channel: MhxyChannel,
    propCategory: MhxyPropCategory | null,
    amount: number,
    type: MHXY_GOLD_RECORD_TYPE,
    status: MHXY_GOLD_RECORD_STATUS,
    accountNowGold: number,
    remark: string,
    transfer: MhxyAccountGoldTransfer = null,
  ) {
    // 创建收支记录
    const record = this.goldRecordRepository.create({
      account,
      user,
      channel,
      propCategory,
      amount,
      type,
      status,
      remark,
      transfer,
    });
    await manager.save(record);
    // 更新用户金币数量
    if (status === MHXY_GOLD_RECORD_STATUS.COMPLETE) {
      let lockGold = account.lockGold;
      if (channel.key === MHXY_CHANNEL_DEFAULT_KEY.GOLD_LOCK) {
        // 金币被锁
        lockGold += amount;
      } else if (channel.key === MHXY_CHANNEL_DEFAULT_KEY.GOLD_UNLOCK) {
        // 金币解锁
        lockGold -= amount;
        if (lockGold < 0) {
          throw new BusinessException('输入金额大于被锁的金币数，请检查后操作');
        }
      }
      await manager.update(MhxyAccount, account.id, {
        gold: accountNowGold,
        lockGold,
      });
    }
  }

  async findGoldRecord(where: FindOptionsWhere<MhxyAccountGoldRecord>) {
    return await this.goldRecordRepository.findOne({ where });
  }
}

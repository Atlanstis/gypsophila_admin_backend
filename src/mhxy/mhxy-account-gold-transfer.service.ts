import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import {
  MhxyAccount,
  MhxyAccountGoldRecord,
  MhxyAccountGoldTransfer,
  MhxyChannel,
  MhxyPropCategory,
} from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { MhxyAccountService } from './mhxy-account.service';
import { BusinessException, CommonPageDto } from 'src/core';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';
import { GoldTransferDto, GoldTransferFinishDto, GoldTransferIdDto } from './dto';
import { SettingService } from 'src/setting/setting.service';
import {
  MHXY_CHANNEL_DEFAULT_KEY,
  MHXY_GOLD_RECORD_STATUS,
  MHXY_GOLD_RECORD_TYPE,
  MHXY_GOLD_TRANSFER_STATUS,
} from './constants';
import { isInt } from 'class-validator';
import { MHXY_TRADE_TAX } from 'src/constants';

@Injectable()
/** 转金相关服务 */
export class MhxyAccountGoldTransferService {
  constructor(
    @InjectRepository(MhxyAccountGoldTransfer)
    private readonly goldTransferRepository: Repository<MhxyAccountGoldTransfer>,
    @InjectRepository(MhxyPropCategory)
    private readonly propCategoryRepository: Repository<MhxyPropCategory>,
    @InjectRepository(MhxyChannel)
    private readonly channelRepository: Repository<MhxyChannel>,
    private readonly userService: UserService,
    private readonly settingService: SettingService,
    private readonly accountService: MhxyAccountService,
    private readonly goldRecordService: MhxyAccountGoldRecordService,
    private dataSource: DataSource,
  ) {}

  /** 新增转金 */
  async goldTransferAdd(dto: GoldTransferDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const fromAccount = await this.accountService.findAccount({
      id: dto.fromAccountId,
      user: {
        id: userId,
      },
    });
    if (!fromAccount) {
      throw new BusinessException('转出账号不存在，请重新选择');
    }
    const toAccount = await this.accountService.findAccount({
      id: dto.toAccountId,
      user: {
        id: userId,
      },
    });
    if (!toAccount) {
      throw new BusinessException('转入账号不存在，请重新选择');
    }
    const propCategory = await this.propCategoryRepository.findOne({
      where: {
        id: dto.propCategoryId,
      },
    });
    if (!propCategory) {
      throw new BusinessException('当前种类不存在，请重新选择');
    }

    const channel = await this.channelRepository.findOne({
      where: {
        key: MHXY_CHANNEL_DEFAULT_KEY.GOLD_TRANSFER,
      },
    });
    if (!channel) {
      throw new BusinessException('默认转金途径不存在，请检查数据库');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      // 非珍品转金，实时到账
      if (!propCategory.isGem) {
        // 支出金额
        const expenditureAmount = fromAccount.gold - dto.fromNowGold;
        // 收入金额
        const revenueAmount = dto.toNowGold - toAccount.gold;
        // 保存转金数据
        const goldTransfer = this.goldTransferRepository.create({
          fromAccount,
          toAccount,
          propCategory,
          user,
          expenditureAmount,
          revenueAmount,
          status: MHXY_GOLD_TRANSFER_STATUS.SUCCESS,
        });
        await queryRunner.manager.save(goldTransfer);
        // 同步转出账号收支记录，并更新账号金币数量
        await this.goldRecordService.createGoldRecord(
          queryRunner.manager,
          fromAccount,
          user,
          channel,
          propCategory,
          expenditureAmount,
          MHXY_GOLD_RECORD_TYPE.EXPENDITURE,
          MHXY_GOLD_RECORD_STATUS.COMPLETE,
          dto.fromNowGold,
          '',
          goldTransfer,
        );
        // 同步转入账号收支记录，并更新账号金币数量
        await this.goldRecordService.createGoldRecord(
          queryRunner.manager,
          toAccount,
          user,
          channel,
          propCategory,
          revenueAmount,
          MHXY_GOLD_RECORD_TYPE.REVENUE,
          MHXY_GOLD_RECORD_STATUS.COMPLETE,
          dto.toNowGold,
          '',
          goldTransfer,
        );
      } else {
        // 珍品转金，需要等待审核
        if (!isInt(dto.goldAmount) && dto.goldAmount <= 0) {
          throw new BusinessException('goldAmount 类型错误');
        }
        // 支出金额
        const expenditureAmount = dto.goldAmount;
        // 保存转金数据
        const goldTransfer = this.goldTransferRepository.create({
          fromAccount,
          toAccount,
          propCategory,
          user,
          expenditureAmount,
          revenueAmount: 0,
          status: MHXY_GOLD_TRANSFER_STATUS.PROGRESS,
        });
        await queryRunner.manager.save(goldTransfer);
        // 转出账号金币直接扣除
        await this.goldRecordService.createGoldRecord(
          queryRunner.manager,
          fromAccount,
          user,
          channel,
          propCategory,
          expenditureAmount,
          MHXY_GOLD_RECORD_TYPE.EXPENDITURE,
          MHXY_GOLD_RECORD_STATUS.COMPLETE,
          fromAccount.gold - dto.goldAmount,
          '',
          goldTransfer,
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

  /** 转金记录 */
  async goldTransferList(dto: CommonPageDto, userId: string) {
    const { page, size } = dto;
    const [list, total] = await this.goldTransferRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        fromAccount: true,
        toAccount: true,
        propCategory: true,
      },
    });
    return { list, total };
  }

  /** 单个转金记录 */
  async goldTransferInfo(dto: GoldTransferIdDto, userId: string) {
    const goldTransfer = await this.goldTransferRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        fromAccount: true,
        toAccount: true,
        propCategory: true,
      },
    });
    if (!goldTransfer) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    // 计算珍品交易中，所收的税
    const tax = await this.settingService.getSettingByKey(MHXY_TRADE_TAX, [
      [(tax) => !tax, '请先设置 MHXY_TRADE_TAX'],
      [(tax) => isNaN(Number(tax.value)), 'MHXY_TRADE_TAX 设置错误'],
    ]);
    // 计算初始实际到账金额
    const realAmount = Number(
      new BigNumber(goldTransfer.expenditureAmount * (100 - Number(tax.value)) * 0.01).toFixed(0),
    );
    return { ...goldTransfer, realAmount };
  }

  /** 珍品转金完成 */
  async goldTransferFinish(dto: GoldTransferFinishDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const goldTransfer = await this.goldTransferRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        fromAccount: true,
        toAccount: true,
        propCategory: true,
      },
    });
    if (!goldTransfer) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    if (goldTransfer.status !== MHXY_GOLD_TRANSFER_STATUS.PROGRESS) {
      throw new BusinessException('当前记录已处理');
    }
    const channel = await this.channelRepository.findOne({
      where: {
        key: MHXY_CHANNEL_DEFAULT_KEY.GOLD_TRANSFER,
      },
    });
    if (!channel) {
      throw new BusinessException('默认转金途径不存在，请检查数据库');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      debugger;
      if (dto.status === MHXY_GOLD_TRANSFER_STATUS.SUCCESS) {
        // 转金成功
        // 转入账号，增加金币
        await this.goldRecordService.createGoldRecord(
          queryRunner.manager,
          goldTransfer.toAccount,
          user,
          channel,
          goldTransfer.propCategory,
          dto.amount,
          MHXY_GOLD_RECORD_TYPE.REVENUE,
          MHXY_GOLD_RECORD_STATUS.COMPLETE,
          goldTransfer.toAccount.gold + dto.amount,
          '',
          goldTransfer,
        );
        goldTransfer.status = MHXY_GOLD_TRANSFER_STATUS.SUCCESS;
        goldTransfer.revenueAmount = dto.amount;
      } else if (dto.status === MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK) {
        // 将对应的收支记录的途径修改为金币被锁
        const record = await this.goldRecordService.findGoldRecord({
          transfer: { id: goldTransfer.id },
        });
        if (!record) {
          throw new BusinessException('对应转金记录不存在');
        }
        const goldLockChannel = await this.channelRepository.findOne({
          where: {
            key: MHXY_CHANNEL_DEFAULT_KEY.GOLD_LOCK,
          },
        });
        if (!goldLockChannel) {
          throw new BusinessException('金币被锁渠道不存在，请检查数据库');
        }
        record.channel = goldLockChannel;
        await queryRunner.manager.save(record);
        // 更改转金状态
        goldTransfer.status = MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK;
        goldTransfer.revenueAmount = 0;
        // 更改账号被锁金币数
        const account = goldTransfer.fromAccount;
        account.lockGold += dto.amount;
        await queryRunner.manager.save(account);
      }
      // 更改转金状态
      await queryRunner.manager.save(goldTransfer);
      // 提交事务
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /** 转金记录-撤销 */
  async goldTransferRevert(dto: GoldTransferIdDto, userId: string) {
    const goldTransfer = await this.goldTransferRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        fromAccount: true,
        toAccount: true,
        records: true,
      },
    });
    if (!goldTransfer) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      let fromAccountAmount = goldTransfer.fromAccount.gold;
      let toAccountAmount = goldTransfer.toAccount.gold;
      if (goldTransfer.status === MHXY_GOLD_TRANSFER_STATUS.SUCCESS) {
        // 已成功，修改转金双方金额
        fromAccountAmount += goldTransfer.expenditureAmount;
        toAccountAmount -= goldTransfer.expenditureAmount;
      } else if (goldTransfer.status === MHXY_GOLD_TRANSFER_STATUS.PROGRESS) {
        // 进行中，修改转出方金额
        fromAccountAmount += goldTransfer.expenditureAmount;
      } else if (goldTransfer.status === MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK) {
        // 转出方锁定，无法撤销
        throw new BusinessException('转金金币被锁，无法撤销');
      }
      // 删除对应收支记录
      if (goldTransfer.records.length) {
        await queryRunner.manager.delete(
          MhxyAccountGoldRecord,
          goldTransfer.records.map((record) => record.id),
        );
      }
      // 删除转金记录
      await queryRunner.manager.delete(MhxyAccountGoldTransfer, [goldTransfer.id]);
      // 修改转金双方金币数量
      await queryRunner.manager.update(MhxyAccount, goldTransfer.fromAccount.id, {
        gold: fromAccountAmount,
      });
      await queryRunner.manager.update(MhxyAccount, goldTransfer.toAccount.id, {
        gold: toAccountAmount,
      });
      // 提交事务
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

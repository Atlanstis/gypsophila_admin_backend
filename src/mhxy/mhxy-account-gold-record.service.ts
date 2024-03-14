import { Injectable } from '@nestjs/common';
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
    private readonly settingService: SettingService,
    private readonly userService: UserService,
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
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      if (dto.amountType === MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT) {
        // 按账号当前金币数计算收支
        const diff = dto.nowAmount - account.gold;
        if (diff === 0) {
          throw new BusinessException('当前账号金币余额未发生变化');
        }
        const amount = Math.abs(diff);
        const type = diff > 0 ? MHXY_GOLD_RECORD_TYPE.REVENUE : MHXY_GOLD_RECORD_TYPE.EXPENDITURE;
        await this.createGoldRecord(
          queryRunner.manager,
          account,
          user,
          channel,
          null,
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
          null,
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
    return { record, realAmount };
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
      await manager.update(MhxyAccount, account.id, {
        gold: accountNowGold,
      });
    }
  }

  async findGoldRecord(where: FindOptionsWhere<MhxyAccountGoldRecord>) {
    return await this.goldRecordRepository.findOne({ where });
  }
}

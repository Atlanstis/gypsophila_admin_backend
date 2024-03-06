import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MhxyAccountGoldTransfer, MhxyGoldTradeCategory } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { GoldTransferDto, GoldTransferFinishDto, GoldTransferInfoDto } from './dto';
import { UserService } from 'src/user/user.service';
import { MhxyService } from './mhxy.service';
import { BusinessException, CommonPageDto } from 'src/core';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';
import * as dayjs from 'dayjs';
import { isInt } from 'class-validator';
import { DefaultTradeCategory, GoldTransferFinishStatus } from './constants';

@Injectable()
/** 转金相关服务 */
export class MhxyAccountGoldTransferService {
  constructor(
    @InjectRepository(MhxyAccountGoldTransfer)
    private readonly mhxyAccountGoldTransferRepository: Repository<MhxyAccountGoldTransfer>,
    @InjectRepository(MhxyGoldTradeCategory)
    private readonly mhxyGoldTradeCategoryRepository: Repository<MhxyGoldTradeCategory>,
    private readonly userService: UserService,
    private readonly mhxyService: MhxyService,
    private readonly mhxyAccountGoldRecordService: MhxyAccountGoldRecordService,
    private dataSource: DataSource,
  ) {}

  /** 新增转金 */
  async goldTransferAdd(dto: GoldTransferDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const fromAccount = await this.mhxyService.findAccount({
      id: dto.fromAccountId,
      user: {
        id: userId,
      },
    });
    if (!fromAccount) {
      throw new BusinessException('发起账号不存在，请重新选择');
    }
    const toAccount = await this.mhxyService.findAccount({
      id: dto.toAccountId,
      user: {
        id: userId,
      },
    });
    if (!toAccount) {
      throw new BusinessException('接受账号不存在，请重新选择');
    }
    const category = await this.mhxyGoldTradeCategoryRepository.findOne({
      where: {
        id: dto.categoryId,
      },
    });
    if (!category) {
      throw new BusinessException('当前种类不存在，请重新选择');
    }
    if (!category.isTransfer) {
      throw new BusinessException('当前种类无法转金，请重新选择');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      // 非珍品转金，实时到账
      if (!category.isGem) {
        // 保存转金数据
        const goldTransfer = this.mhxyAccountGoldTransferRepository.create({
          fromAccount,
          toAccount,
          user,
          fromBeforeGold: fromAccount.gold,
          fromAfterGold: dto.fromNowGold,
          toBeforeGold: toAccount.gold,
          toAfterGold: dto.toNowGold,
          category,
          isGem: category.isGem,
          status: '1',
        });
        await queryRunner.manager.save(goldTransfer);
        // 同步新建金币收支记录，并更新账号金币数量
        await this.mhxyAccountGoldRecordService.createGoldRecord(
          queryRunner.manager,
          dto.fromNowGold,
          user,
          fromAccount,
          category,
          `转金-${category.name}`,
          true,
          goldTransfer,
        );
        await this.mhxyAccountGoldRecordService.createGoldRecord(
          queryRunner.manager,
          dto.toNowGold,
          user,
          toAccount,
          category,
          `转金-${category.name}`,
          true,
          goldTransfer,
        );
      } else {
        // 珍品转金，需要等待审核
        if (!isInt(dto.goldAmount)) {
          throw new BusinessException('goldAmount 类型错误');
        }
        if (!isInt(dto.auditEndHours)) {
          throw new BusinessException('auditEndHours 类型错误');
        }
        const goldTransfer = this.mhxyAccountGoldTransferRepository.create({
          fromAccount,
          toAccount,
          user,
          category,
          isGem: category.isGem,
          goldAmount: dto.goldAmount,
          fromBeforeGold: fromAccount.gold,
          fromAfterGold: fromAccount.gold - dto.goldAmount,
          auditEndTime: dayjs().add(dto.auditEndHours, 'hour').toDate(),
          status: '0',
        });
        await queryRunner.manager.save(goldTransfer);
        // 转出方金币直接扣除
        await this.mhxyAccountGoldRecordService.createGoldRecord(
          queryRunner.manager,
          fromAccount.gold - dto.goldAmount,
          user,
          fromAccount,
          category,
          `转金-${category.name}`,
          true,
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
    const [list, total] = await this.mhxyAccountGoldTransferRepository.findAndCount({
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
        category: true,
      },
    });
    return { list, total };
  }

  /** 单个转金记录 */
  async goldTransferInfo(dto: GoldTransferInfoDto, userId: string) {
    const goldTransfer = await this.mhxyAccountGoldTransferRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        fromAccount: true,
        toAccount: true,
        category: true,
      },
    });
    if (!goldTransfer) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    return goldTransfer;
  }

  /** 珍品转金完成 */
  async goldTransferFinish(dto: GoldTransferFinishDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const goldTransfer = await this.mhxyAccountGoldTransferRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        fromAccount: true,
        toAccount: true,
        category: true,
      },
    });
    if (!goldTransfer) {
      throw new BusinessException('当前记录不存在，或者无查看的权限');
    }
    if (goldTransfer.status !== '0') {
      throw new BusinessException('当前记录已处理');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      if (dto.status === GoldTransferFinishStatus.SUCCESS) {
        // 转金成功
        // 接受账号，增加金币
        await this.mhxyAccountGoldRecordService.createGoldRecord(
          queryRunner.manager,
          goldTransfer.toAccount.gold + dto.amount,
          user,
          goldTransfer.toAccount,
          goldTransfer.category,
          `转金-${goldTransfer.category.name}`,
          true,
          goldTransfer,
        );
        // 更新转金记录接受账号前后金额
        goldTransfer.toBeforeGold = goldTransfer.toAccount.gold;
        goldTransfer.toAfterGold = goldTransfer.toAccount.gold + dto.amount;
      } else if (dto.status === GoldTransferFinishStatus.FAIL_FROM_LOCK) {
        // 转金失败，发起账号金币被锁
        const record = await this.mhxyAccountGoldRecordService.findGoldRecord({
          transfer: { id: goldTransfer.id },
        });
        // 关联收支记录，需为支出项
        if (record.type !== 'expenditure') {
          return new BusinessException('关联收支记录错误');
        }
        // 更改收支记录关联贸易种类
        const category = await this.mhxyGoldTradeCategoryRepository.findOne({
          where: {
            id: DefaultTradeCategory.GOLD_LOCK,
          },
        });
        if (!category) {
          throw new BusinessException('默认种类（金币被扣）项缺失，请检查数据库');
        }
        record.category = category;
        await queryRunner.manager.save(record);
        // 更改账号被锁金币数
        const account = goldTransfer.fromAccount;
        account.lockGold += Math.abs(record.amount);
        await queryRunner.manager.save(account);
        // 记录转金记录接受账号前后金额
        goldTransfer.toBeforeGold = goldTransfer.toAccount.gold;
        goldTransfer.toAfterGold = goldTransfer.toAccount.gold;
      }
      // 更改转金状态
      goldTransfer.status = '1';
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
}

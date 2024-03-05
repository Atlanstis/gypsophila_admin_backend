import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MhxyAccountGoldTransfer, MhxyGoldTradeCategory } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { MhxyAccountGoldTransferDto } from './dto';
import { UserService } from 'src/user/user.service';
import { MhxyService } from './mhxy.service';
import { BusinessException, CommonPageDto } from 'src/core';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';

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

  async goldTransferAdd(dto: MhxyAccountGoldTransferDto, userId: string) {
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
          isGem: false,
          isFinish: true,
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
}

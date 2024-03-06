import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException, CommonPageDto } from 'src/core';
import {
  MhxyAccount,
  MhxyAccountGoldRecord,
  MhxyAccountGoldTransfer,
  MhxyGoldTradeCategory,
  User,
} from 'src/entities';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { GoldRecordDto } from './dto';
import { UserService } from 'src/user/user.service';
import { MhxyService } from './mhxy.service';

@Injectable()
/** 金币收支记录相关服务 */
export class MhxyAccountGoldRecordService {
  constructor(
    @InjectRepository(MhxyAccountGoldRecord)
    private readonly accountGoldRecordRepository: Repository<MhxyAccountGoldRecord>,
    @InjectRepository(MhxyGoldTradeCategory)
    private readonly mhxyGoldTradeCategoryRepository: Repository<MhxyGoldTradeCategory>,
    private readonly userService: UserService,
    private readonly mhxyService: MhxyService,
    private dataSource: DataSource,
  ) {}

  /** 获取当前用户下，梦幻账号的金币收支记录 */
  async goldRecordList(dto: CommonPageDto, userId: string) {
    const { page, size } = dto;
    const [list, total] = await this.accountGoldRecordRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        account: true,
        category: true,
      },
    });
    return { list, total };
  }

  /** 新增收支记录 */
  async goldRecordAdd(dto: GoldRecordDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const account = await this.mhxyService.findAccount({
      id: dto.accountId,
      user: {
        id: userId,
      },
    });
    if (!account) {
      throw new BusinessException('当前账号不存在，请重新选择');
    }
    const category = await this.mhxyGoldTradeCategoryRepository.findOne({
      where: {
        id: dto.categoryId,
      },
    });
    if (!category) {
      throw new BusinessException('当前种类不存在，请重新选择');
    }

    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await this.createGoldRecord(
        queryRunner.manager,
        dto.nowGold,
        user,
        account,
        category,
        dto.remark,
      );
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
   * 创建收支记录
   * @param manager 事务对象
   * @param nowGold 账号当前金币数
   * @param user 归属系统用户
   * @param account 归属梦幻账户
   * @param category 贸易种类
   * @param remark 备注
   * @param isTransfer 是否是转金
   * @param transfer 转金记录
   */
  async createGoldRecord(
    manager: EntityManager,
    nowGold: number,
    user: User,
    account: MhxyAccount,
    category: MhxyGoldTradeCategory,
    remark: string,
    isTransfer: boolean = false,
    transfer: MhxyAccountGoldTransfer | null = null,
  ) {
    // 创建收支记录
    const amount = nowGold - account.gold;
    const accountGoldRecord = this.accountGoldRecordRepository.create({
      amount,
      afterGold: nowGold,
      beforeGold: account.gold,
      type: amount > 0 ? 'revenue' : 'expenditure',
      user,
      account,
      category,
      remark,
      isTransfer,
      transfer,
    });
    await manager.save(accountGoldRecord);
    // 更新用户金币数量
    account.gold = nowGold;
    await manager.save(account);
  }

  async findGoldRecord(where: FindOptionsWhere<MhxyAccountGoldRecord>) {
    return await this.accountGoldRecordRepository.findOne({ where });
  }
}

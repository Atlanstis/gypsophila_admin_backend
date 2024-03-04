import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException, CommonPageDto } from 'src/core';
import { MhxyAccount, MhxyAccountGoldRecord, MhxyGoldTradeCategory } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { MhxyAccountGoldRecordDto } from './dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MhxyAccountGoldRecordService {
  constructor(
    @InjectRepository(MhxyAccount)
    private readonly mhxyAccountRepository: Repository<MhxyAccount>,
    @InjectRepository(MhxyAccountGoldRecord)
    private readonly accountGoldRecordRepository: Repository<MhxyAccountGoldRecord>,
    @InjectRepository(MhxyGoldTradeCategory)
    private readonly mhxyGoldTradeCategoryRepository: Repository<MhxyGoldTradeCategory>,
    private readonly userService: UserService,
    private dataSource: DataSource,
  ) {}

  /** 用户当前用户下，梦幻账号的金币收支记录 */
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
  async goldRecordAdd(dto: MhxyAccountGoldRecordDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const account = await this.mhxyAccountRepository.findOne({
      where: {
        id: dto.accountId,
        user: {
          id: userId,
        },
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
      // 创建记录对象
      const num = dto.nowGold - account.gold;
      const accountGoldRecord = this.accountGoldRecordRepository.create({
        num,
        afterNum: dto.nowGold,
        beforeNum: account.gold,
        type: num > 0 ? 'revenue' : 'expenditure',
        user,
        account,
        category,
        remark: dto.remark,
      });
      await queryRunner.manager.save(accountGoldRecord);
      // 更新用户金币数量
      account.gold = dto.nowGold;
      await queryRunner.manager.save(account);
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

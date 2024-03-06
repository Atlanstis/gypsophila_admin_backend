import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MhxyAccountGoldRecord,
  MhxyAccountGoldTransfer,
  MhxyGoldTradeCategory,
} from 'src/entities';
import { FindManyOptions, Repository } from 'typeorm';
import {
  GoldTradeCategoryAddDto,
  GoldTradeCategoryDeleteDto,
  GoldTradeCategoryEditDto,
  GoldTradeCategorySearchDto,
} from './dto';
import { BusinessException, CommonPageDto } from 'src/core';

@Injectable()
/** 贸易种类相关服务 */
export class MhxyGoldTradeCategoryService {
  constructor(
    @InjectRepository(MhxyGoldTradeCategory)
    private readonly mhxyGoldTradeCategoryRepository: Repository<MhxyGoldTradeCategory>,
    @InjectRepository(MhxyAccountGoldRecord)
    private readonly accountGoldRecordRepository: Repository<MhxyAccountGoldRecord>,
    @InjectRepository(MhxyAccountGoldTransfer)
    private readonly accountGoldTransferRepository: Repository<MhxyAccountGoldTransfer>,
  ) {}

  /** 获取贸易种类 */
  async goldTradeCategoryAll(dto: GoldTradeCategorySearchDto) {
    const options: FindManyOptions<MhxyGoldTradeCategory> = {
      where: {
        status: '1',
      },
    };
    if (Object.prototype.hasOwnProperty.call(dto, 'isTransfer')) {
      options.where = { isTransfer: dto.isTransfer, status: '1' };
    }
    return this.mhxyGoldTradeCategoryRepository.find(options);
  }

  /** 获取贸易种类-分页 */
  async goldTradeCategoryList(dto: CommonPageDto) {
    const { page, size } = dto;
    const [list, total] = await this.mhxyGoldTradeCategoryRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });
    return { list, total };
  }

  /** 贸易种类-新增 */
  async goldTradeCategoryAdd(dto: GoldTradeCategoryAddDto) {
    const category = this.mhxyGoldTradeCategoryRepository.create({ ...dto });
    await this.mhxyGoldTradeCategoryRepository.save(category);
  }

  /** 贸易种类-编辑 */
  async goldTradeCategoryEdit(dto: GoldTradeCategoryEditDto) {
    const category = await this.judgeTradeCategoryCanModify(dto.id, '编辑');
    const newCategory = this.mhxyGoldTradeCategoryRepository.create({ ...category, ...dto });
    await this.mhxyGoldTradeCategoryRepository.save(newCategory);
  }

  /** 贸易种类-删除 */
  async goldTradeCategoryDelete(dto: GoldTradeCategoryDeleteDto) {
    const category = await this.judgeTradeCategoryCanModify(dto.id, '删除');
    await this.mhxyGoldTradeCategoryRepository.remove(category);
  }

  /**
   * 判断贸易种类是否可删除或编辑
   * @param id 贸易种类 id
   * @param operation 操作
   * @returns 贸易种类
   */
  async judgeTradeCategoryCanModify(id: number, operation: string) {
    const category = await this.mhxyGoldTradeCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new BusinessException('当前种类不存在');
    }
    const record = await this.accountGoldRecordRepository.findOne({
      where: { category: { id } },
    });
    if (record) {
      throw new BusinessException(`当前种类存在金币收支记录，无法${operation}`);
    }
    const transfer = await this.accountGoldTransferRepository.findOne({
      where: { category: { id } },
    });
    if (transfer) {
      throw new BusinessException(`当前种类存在转金记录，无法${operation}`);
    }
    return category;
  }
}

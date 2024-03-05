import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MhxyGoldTradeCategory } from 'src/entities';
import { FindManyOptions, Repository } from 'typeorm';
import { MhxyGoldTradeCategorySearchDto } from './dto';

@Injectable()
/** 贸易种类相关服务 */
export class MhxyGoldTradeCategoryService {
  constructor(
    @InjectRepository(MhxyGoldTradeCategory)
    private readonly mhxyGoldTradeCategoryRepository: Repository<MhxyGoldTradeCategory>,
  ) {}

  /** 获取贸易种类 */
  async goldTradeCategoryList(dto: MhxyGoldTradeCategorySearchDto) {
    const options: FindManyOptions<MhxyGoldTradeCategory> = {};
    if (Object.prototype.hasOwnProperty.call(dto, 'isTransfer')) {
      options.where = { isTransfer: dto.isTransfer };
    }
    return this.mhxyGoldTradeCategoryRepository.find(options);
  }
}

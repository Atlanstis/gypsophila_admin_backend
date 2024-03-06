import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MhxyGoldTradeCategory } from 'src/entities';
import { FindManyOptions, Repository } from 'typeorm';
import { GoldTradeCategorySearchDto } from './dto';

@Injectable()
/** 贸易种类相关服务 */
export class MhxyGoldTradeCategoryService {
  constructor(
    @InjectRepository(MhxyGoldTradeCategory)
    private readonly mhxyGoldTradeCategoryRepository: Repository<MhxyGoldTradeCategory>,
  ) {}

  /** 获取贸易种类 */
  async goldTradeCategoryList(dto: GoldTradeCategorySearchDto) {
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
}

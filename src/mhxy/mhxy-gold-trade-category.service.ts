import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MhxyGoldTradeCategory } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MhxyGoldTradeCategoryService {
  constructor(
    @InjectRepository(MhxyGoldTradeCategory)
    private readonly mhxyGoldTradeCategoryRepository: Repository<MhxyGoldTradeCategory>,
  ) {}

  async goldTradeCategoryList() {
    return this.mhxyGoldTradeCategoryRepository.find();
  }
}

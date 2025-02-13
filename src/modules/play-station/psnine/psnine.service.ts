import { Injectable } from '@nestjs/common';
import { PsnineGameSearchDto } from './dto';
import { PsnineGameSearchCrawler } from './crawler';
import { BusinessException } from 'src/core';

@Injectable()
export class PsnineService {
  /** 游戏查找 */
  async gameSearch(dto: PsnineGameSearchDto): Promise<ResPsnine.GameSearch> {
    const { title, page } = dto;
    const crawler = new PsnineGameSearchCrawler(title, page);
    await crawler.exec();
    const { error, data } = crawler.getResult();
    if (error) {
      throw new BusinessException(error);
    }
    return data;
  }
}

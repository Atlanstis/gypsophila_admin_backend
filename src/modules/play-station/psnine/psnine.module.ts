import { Module } from '@nestjs/common';
import { PsnineService } from './psnine.service';
import { PsnineController } from './psnine.controller';
import { PsnineCrawlerService } from './psnine-crawler.service';

@Module({
  controllers: [PsnineController],
  providers: [PsnineService, PsnineCrawlerService],
  exports: [PsnineService, PsnineCrawlerService],
})
export class PsnineModule {}

import { Module } from '@nestjs/common';
import { PsnineService } from './psnine.service';
import { PsnineController } from './psnine.controller';

@Module({
  controllers: [PsnineController],
  providers: [PsnineService],
  exports: [PsnineService],
})
export class PsnineModule {}

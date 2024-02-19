import { Module } from '@nestjs/common';
import { PsnineService } from './psnine.service';
import { PsnineController } from './psnine.controller';

@Module({
  imports: [],
  controllers: [PsnineController],
  providers: [PsnineService],
  exports: [PsnineService],
})
export class PsnineModule {}

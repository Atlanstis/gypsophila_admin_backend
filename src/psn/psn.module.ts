import { Module } from '@nestjs/common';
import { PsnService } from './psn.service';
import { PsnController } from './psn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsnProfile } from 'src/entities';
import { PsnineModule } from 'src/psnine/psnine.module';

@Module({
  imports: [TypeOrmModule.forFeature([PsnProfile]), PsnineModule],
  controllers: [PsnController],
  providers: [PsnService],
})
export class PsnModule {}

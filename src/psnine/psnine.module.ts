import { Module } from '@nestjs/common';
import { PsnineService } from './psnine.service';
import { PsnineController } from './psnine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsGame } from 'src/entities/ps-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PsGame])],
  controllers: [PsnineController],
  providers: [PsnineService],
})
export class PsnineModule {}

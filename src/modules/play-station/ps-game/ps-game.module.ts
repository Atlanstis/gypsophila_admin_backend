import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsGame } from 'src/entities';
import { PsGameService } from './ps-game.service';
import { PsGameController } from './ps-game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PsGame])],
  controllers: [PsGameController],
  providers: [PsGameService],
})
export class PsGameModule {}

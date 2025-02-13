import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PsGame,
  PsGamePsnine,
  PsProfile,
  PsProfileGame,
  PsProfileTrophy,
} from 'src/entities';
import { PsProfileService } from './ps-profile.service';
import { PsProfileController } from './ps-profile.controller';
import { PsnineModule } from '../psnine/psnine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PsProfile,
      PsProfileGame,
      PsGamePsnine,
      PsGame,
      PsProfileTrophy,
    ]),
    PsnineModule,
  ],
  controllers: [PsProfileController],
  providers: [PsProfileService],
})
export class PsProfileModule {}

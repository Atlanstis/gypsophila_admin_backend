import { Module } from '@nestjs/common';
import { MhxyService } from './mhxy.service';
import { MhxyController } from './mhxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MhxyAccount } from 'src/entities';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MhxyAccount]), UserModule],
  controllers: [MhxyController],
  providers: [MhxyService],
})
export class MhxyModule {}

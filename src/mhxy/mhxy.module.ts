import { Module } from '@nestjs/common';
import { MhxyAccountService } from './mhxy-account.service';
import { MhxyController } from './mhxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MhxyAccount,
  MhxyAccountGoldRecord,
  MhxyChannel,
  MhxyPropCategory,
  SystemSetting,
} from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { MhxyPropCategoryService } from './mhxy-prop-category.service';
import { MhxyChannelService } from './mhxy-channel.service';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MhxyAccount,
      MhxyPropCategory,
      MhxyChannel,
      MhxyAccountGoldRecord,
      SystemSetting,
    ]),
    UserModule,
  ],
  controllers: [MhxyController],
  providers: [
    MhxyAccountService,
    MhxyPropCategoryService,
    MhxyChannelService,
    MhxyAccountGoldRecordService,
  ],
})
export class MhxyModule {}

import { Module } from '@nestjs/common';
import { MhxyAccountService } from './mhxy-account.service';
import { MhxyController } from './mhxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MhxyAccount,
  MhxyAccountGoldRecord,
  MhxyAccountGoldTransfer,
  MhxyChannel,
  MhxyPropCategory,
} from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { SettingModule } from 'src/setting/setting.module';
import { MhxyPropCategoryService } from './mhxy-prop-category.service';
import { MhxyChannelService } from './mhxy-channel.service';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';
import { MhxyAccountGoldTransferService } from './mhxy-account-gold-transfer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MhxyAccount,
      MhxyPropCategory,
      MhxyChannel,
      MhxyAccountGoldRecord,
      MhxyAccountGoldTransfer,
    ]),
    UserModule,
    SettingModule,
  ],
  controllers: [MhxyController],
  providers: [
    MhxyAccountService,
    MhxyPropCategoryService,
    MhxyChannelService,
    MhxyAccountGoldRecordService,
    MhxyAccountGoldTransferService,
  ],
})
export class MhxyModule {}

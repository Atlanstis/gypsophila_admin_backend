import { Module } from '@nestjs/common';
import { MhxyAccountService } from './mhxy-account.service';
import { MhxyController } from './mhxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MhxyAccount,
  MhxyAccountGoldRecord,
  MhxyAccountGoldTransfer,
  MhxyAccountGroup,
  MhxyAccountGroupItem,
  MhxyChannel,
  MhxyGoldTransferPolicy,
  MhxyGoldTransferPolicyApply,
  MhxyPropCategory,
} from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { SettingModule } from 'src/setting/setting.module';
import { MhxyPropCategoryService } from './mhxy-prop-category.service';
import { MhxyChannelService } from './mhxy-channel.service';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';
import { MhxyAccountGoldTransferService } from './mhxy-account-gold-transfer.service';
import { MhxyAccountGroupService } from './mhxy-account-group.service';
import { MhxyGoldTransferPolicyService } from './mhxy-gold-transfer-policy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MhxyAccount,
      MhxyPropCategory,
      MhxyChannel,
      MhxyAccountGoldRecord,
      MhxyAccountGoldTransfer,
      MhxyAccountGroup,
      MhxyAccountGroupItem,
      MhxyGoldTransferPolicy,
      MhxyGoldTransferPolicyApply,
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
    MhxyAccountGroupService,
    MhxyGoldTransferPolicyService,
  ],
})
export class MhxyModule {}

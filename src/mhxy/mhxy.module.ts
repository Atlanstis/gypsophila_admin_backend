import { Module } from '@nestjs/common';
import { MhxyAccountService } from './mhxy-account.service';
import { MhxyController } from './mhxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MhxyAccount, MhxyChannel, MhxyPropCategory } from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { MhxyPropCategoryService } from './mhxy-prop-category.service';
import { MhxyChannelService } from './mhxy-channel.service';

@Module({
  imports: [TypeOrmModule.forFeature([MhxyAccount, MhxyPropCategory, MhxyChannel]), UserModule],
  controllers: [MhxyController],
  providers: [MhxyAccountService, MhxyPropCategoryService, MhxyChannelService],
})
export class MhxyModule {}

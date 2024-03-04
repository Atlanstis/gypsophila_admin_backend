import { Module } from '@nestjs/common';
import { MhxyService } from './mhxy.service';
import { MhxyController } from './mhxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MhxyAccount, MhxyAccountGoldRecord, MhxyGoldTradeCategory } from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { MhxyGoldTradeCategoryService } from './mhxy-gold-trade-category.service';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MhxyAccount, MhxyGoldTradeCategory, MhxyAccountGoldRecord]),
    UserModule,
  ],
  controllers: [MhxyController],
  providers: [MhxyService, MhxyGoldTradeCategoryService, MhxyAccountGoldRecordService],
})
export class MhxyModule {}

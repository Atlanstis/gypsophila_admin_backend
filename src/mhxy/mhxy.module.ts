import { Module } from '@nestjs/common';
import { MhxyAccountService } from './mhxy-account.service';
import { MhxyController } from './mhxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MhxyAccount, MhxyPropCategory } from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { MhxyPropCategoryService } from './mhxy-prop-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([MhxyAccount, MhxyPropCategory]), UserModule],
  controllers: [MhxyController],
  providers: [MhxyAccountService, MhxyPropCategoryService],
})
export class MhxyModule {}

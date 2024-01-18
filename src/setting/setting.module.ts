import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSetting } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting])],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}

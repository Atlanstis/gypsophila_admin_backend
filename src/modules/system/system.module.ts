import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { SettingModule } from './modules/setting/setting.module';

@Module({
  imports: [SettingModule],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}

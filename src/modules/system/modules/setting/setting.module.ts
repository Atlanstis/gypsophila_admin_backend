import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSetting } from 'src/entities';
import { RoleModule } from 'src/modules/management/role/role.module';
import { MenuPermissionModule } from 'src/modules/management/menu/menu-permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemSetting]),
    RoleModule,
    MenuPermissionModule,
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}

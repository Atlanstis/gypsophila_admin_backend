import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuPermissionService } from './menu-permission.service';
import { MenuController } from './menu.controller';
import { MenuPermissionController } from './menu-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, MenuPermission, RoleMenuPermission } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, MenuPermission, RoleMenuPermission]),
  ],
  controllers: [MenuController, MenuPermissionController],
  providers: [MenuService, MenuPermissionService],
  exports: [MenuService, MenuPermissionService],
})
export class MenuModule {}

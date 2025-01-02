import { forwardRef, Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Role, RoleMenuPermission } from 'src/entities';
import { MenuModule } from '../menu/menu.module';
import { MenuPermissionModule } from '../menu/menu-permission.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleMenuPermission, Menu]),
    forwardRef(() => MenuModule),
    MenuPermissionModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

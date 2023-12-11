import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Permission, Role, RoleMenuPermission } from 'src/entities';
import { MenuModule } from 'src/menu/menu.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleMenuPermission, Menu, Permission]), MenuModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

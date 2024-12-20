import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, MenuPermission, Role, RoleMenuPermission } from 'src/entities';
import { MenuModule } from 'src/modules/management/menu/menu.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleMenuPermission, Menu, MenuPermission]),
    MenuModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

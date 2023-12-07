import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Permission, RoleMenuPermission } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Permission, RoleMenuPermission])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}

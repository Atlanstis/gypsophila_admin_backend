import { Module } from '@nestjs/common';
import { MenuPermissionService } from './menu-permission.service';
import { MenuPermissionController } from './menu-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuPermission } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([MenuPermission])],
  controllers: [MenuPermissionController],
  providers: [MenuPermissionService],
  exports: [MenuPermissionService],
})
export class MenuPermissionModule {}

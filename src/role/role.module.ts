import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), MenuModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

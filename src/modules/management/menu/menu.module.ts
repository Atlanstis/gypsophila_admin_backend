import { forwardRef, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/entities';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), forwardRef(() => RoleModule)],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}

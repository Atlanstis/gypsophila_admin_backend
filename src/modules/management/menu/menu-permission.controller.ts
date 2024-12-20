import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard, PermissionGuard, RequirePermission } from 'src/core';
import { MenuPermissionService } from './menu-permission.service';
import {
  MenuIdDto,
  MenuPermissionIdDto,
  PermissionAddDto,
  PermissionEditDto,
} from './dto';

@Controller('menu/permission')
@UseGuards(JwtGuard)
export class MenuPermissionController {
  constructor(private readonly mpService: MenuPermissionService) {}

  /** 获取菜单权限选项 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionList(@Body() dto: MenuIdDto) {
    return await this.mpService.permissionList(dto.menuId);
  }

  /** 菜单增加权限选项 */
  @Post('/add')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionAdd(@Body() dto: PermissionAddDto) {
    return await this.mpService.permissionAdd(dto);
  }

  /** 菜单权限选项编辑 */
  @Post('/edit')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionEdit(@Body() dto: PermissionEditDto) {
    return await this.mpService.permissionEdit(dto);
  }

  /** 菜单权限选项删除 */
  @Get('/delete')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionDelete(@Query() dto: MenuPermissionIdDto) {
    return await this.mpService.permissionDelete(dto.id);
  }
}

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  JwtGuard,
  PermissionGuard,
  RawData,
  RequirePermission,
  ResponseData,
} from 'src/core';
import { MenuPermissionService } from './menu-permission.service';
import {
  MenuIdDto,
  MenuPermissionIdDto,
  PermissionAddDto,
  PermissionEditDto,
} from './dto';
import { MenuPermissionManage } from './constants';

@Controller('menu/permission')
@UseGuards(JwtGuard)
export class MenuPermissionController {
  constructor(private readonly mpService: MenuPermissionService) {}

  /** 获取菜单权限选项 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission(MenuPermissionManage)
  async permissionList(@Body() dto: MenuIdDto) {
    return await this.mpService.getPermissionList({ id: dto.menuId });
  }

  /** 菜单增加权限选项 */
  @Post('/add')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(MenuPermissionManage)
  async permissionAdd(@Body() dto: PermissionAddDto) {
    await this.mpService.permissionAdd(dto);
    return ResponseData.success(null, '新增成功');
  }

  /** 菜单权限选项编辑 */
  @Post('/edit')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(MenuPermissionManage)
  async permissionEdit(@Body() dto: PermissionEditDto) {
    await this.mpService.permissionEdit(dto);
    return ResponseData.success(null, '编辑成功');
  }

  /** 菜单权限选项删除 */
  @Get('/delete')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(MenuPermissionManage)
  async permissionDelete(@Query() dto: MenuPermissionIdDto) {
    await this.mpService.permissionDelete(dto.id);
    return ResponseData.success(null, '删除成功');
  }
}

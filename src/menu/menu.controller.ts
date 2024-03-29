import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MenuService } from './menu.service';
import {
  BusinessException,
  JwtGuard,
  CommonPageDto,
  PermissionGuard,
  RequirePermission,
} from 'src/core';
import {
  MenuDto,
  MenuEditDto,
  MenuIdDto,
  MenuKeyDto,
  PermissionDto,
  PermissionEditDto,
} from './dto';

const numberParse = (parameter) =>
  new ParseIntPipe({
    exceptionFactory: () => {
      throw new BusinessException(`${parameter} 参数格式错误`);
    },
  });

@Controller('menu')
@UseGuards(JwtGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /** 根据页码跟长度获取一级菜单列表及其子菜单 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuList')
  async list(@Body() dto: CommonPageDto) {
    return await this.menuService.list(dto.page, dto.size);
  }

  /** 获取一级菜单数据 */
  @Get('/list/top')
  @UseGuards(PermissionGuard)
  @RequirePermission(['MenuAdd', 'MenuEdit'])
  async listTop() {
    return await this.menuService.listTop();
  }

  /** 添加菜单 */
  @Post('/add')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuAdd')
  async add(@Body() dto: MenuDto) {
    return await this.menuService.add(dto);
  }

  /** 编辑菜单 */
  @Post('/edit')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuEdit')
  async edit(@Body() dto: MenuEditDto) {
    return await this.menuService.edit(dto);
  }

  /** 删除菜单 */
  @Get('/delete')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuDelete')
  async delete(@Query('id', numberParse('id')) id: number) {
    return await this.menuService.delete(id);
  }

  /** 菜单增加权限选项 */
  @Post('/permission/add')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionAdd(@Body() dto: PermissionDto) {
    return await this.menuService.permissionAdd(dto);
  }

  /** 菜单权限选项编辑 */
  @Post('/permission/edit')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionEdit(@Body() dto: PermissionEditDto) {
    return await this.menuService.permissionEdit(dto);
  }

  /** 菜单权限选项删除 */
  @Get('/permission/delete')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionDelete(@Query('id', numberParse('id')) id: number) {
    return await this.menuService.permissionDelete(id);
  }

  /** 获取菜单权限选项 */
  @Post('/permission/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuPermission')
  async permissionList(@Body() dto: MenuIdDto) {
    return await this.menuService.permissionList(dto.menuId);
  }

  /** 获取当前用户当前页面的操作权限 */
  @Post('/operation/permission')
  async permissionSearch(@Body() dto: MenuKeyDto, @Req() req: Request) {
    return await this.menuService.permissionSearch(dto.key, req.user.roleIds);
  }
}

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  JwtGuard,
  CommonPageDto,
  PermissionGuard,
  RequirePermission,
} from 'src/core';
import { MenuAddDto, MenuEditDto, IdDto } from './dto';

@Controller('menu')
@UseGuards(JwtGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /** 根据页码跟长度获取一级菜单列表及其子菜单 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuWatch')
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
  async add(@Body() dto: MenuAddDto) {
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
  async delete(@Query() dto: IdDto) {
    return await this.menuService.delete(dto.id);
  }

  // /** 获取当前用户当前页面的操作权限 */
  // @Post('/operation/permission')
  // async permissionSearch(@Body() dto: MenuKeyDto, @Req() req: Request) {
  //   return await this.menuService.permissionSearch(dto.key, req.user.roleIds);
  // }
}

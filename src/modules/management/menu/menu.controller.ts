import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  JwtGuard,
  CommonPageDto,
  PermissionGuard,
  RequirePermission,
  RawData,
  ResponseData,
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
  async list(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.menuService.list(dto, req.user);
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
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuAdd')
  async add(@Body() dto: MenuAddDto) {
    await this.menuService.add(dto);
    return ResponseData.success(null, '新增成功');
  }

  /** 编辑菜单 */
  @Post('/edit')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuEdit')
  async edit(@Body() dto: MenuEditDto) {
    await this.menuService.edit(dto);
    return ResponseData.success(null, '编辑成功');
  }

  /** 删除菜单 */
  @Get('/delete')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission('MenuDelete')
  async delete(@Query() dto: IdDto) {
    await this.menuService.delete(dto.id);
    return ResponseData.success(null, '删除成功');
  }

  /** 页面配置 */
  @Get('config')
  async config(@Req() req: Request) {
    return await this.menuService.getPageConfig(req.user.roleIds);
  }
}

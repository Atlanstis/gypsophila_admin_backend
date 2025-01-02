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
import { RoleService } from './role.service';
import {
  JwtGuard,
  CommonPageDto,
  PermissionGuard,
  RequirePermission,
  RawData,
  ResponseData,
} from 'src/core';
import { RMPEditDto, RoleAddDto, RoleEditDto, RoleIdDto } from './dto';

@Controller('role')
@UseGuards(JwtGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /** 获取角色列表 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleWatch')
  async list(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.roleService.list(dto, req.user);
  }

  /** 新增角色 */
  @Post('/add')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleAdd')
  async add(@Body() dto: RoleAddDto) {
    await this.roleService.add(dto);
    return ResponseData.success(null, '新增成功');
  }

  /** 编辑角色 */
  @Post('/edit')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleEdit')
  async edit(@Body() dto: RoleEditDto) {
    await this.roleService.edit(dto);
    return ResponseData.success(null, '编辑成功');
  }

  /** 删除角色 */
  @Get('/delete')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleDelete')
  async delete(@Query() dto: RoleIdDto) {
    await this.roleService.delete(dto.id);
    return ResponseData.success(null, '删除成功');
  }

  /** 获取可以分配的角色，使用于用户新增编辑 */
  @Get('/assignable')
  @UseGuards(PermissionGuard)
  @RequirePermission(['UserAdd', 'UserEdit'])
  async assignable() {
    return await this.roleService.assignable();
  }

  /** 页面配置 */
  @Get('/config')
  async config(@Req() req: Request) {
    return this.roleService.getPageConfig(req.user.roleIds);
  }

  /** 获取该角色下可以访问的菜单 */
  @Post('/menu/permission')
  @UseGuards(PermissionGuard)
  @RequirePermission('RolePermissionSet')
  async menuPermission(@Body() dto: RoleIdDto) {
    return await this.roleService.menuPermission(dto.id);
  }

  /** 编辑该角色下可以访问的菜单 */
  @Post('/menu/permission/edit')
  @UseGuards(PermissionGuard)
  @RequirePermission('RolePermissionSet')
  async menuPermissionEdit(@Body() dto: RMPEditDto) {
    return await this.roleService.menuPermissionEdit(dto);
  }
}

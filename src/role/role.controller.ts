import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { BusinessException, JwtGuard, PageDto, PermissionGuard, RequirePermission } from 'src/core';
import { RoleDto, RoleEditDto, RoleMenuDto, RoleMenuEditDto } from './dto';

const numberParse = (parameter) =>
  new ParseIntPipe({
    exceptionFactory: () => {
      throw new BusinessException(`${parameter} 参数格式错误`);
    },
  });

@Controller('role')
@UseGuards(JwtGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /** 获取角色列表 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleList')
  async list(@Body() dto: PageDto) {
    return await this.roleService.list(dto.page, dto.size);
  }

  /** 新增角色 */
  @Post('/add')
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleAdd')
  async add(@Body() dto: RoleDto) {
    return await this.roleService.add(dto);
  }

  /** 编辑角色 */
  @Post('/edit')
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleEdit')
  async edit(@Body() dto: RoleEditDto) {
    return await this.roleService.edit(dto);
  }

  /** 删除角色 */
  @Get('/delete')
  @UseGuards(PermissionGuard)
  @RequirePermission('RoleDelete')
  async delete(@Query('id', numberParse('id')) id: number) {
    return await this.roleService.delete(id);
  }

  /** 获取可以分配的角色，使用于用户新增编辑 */
  @Get('/list/assignable')
  @UseGuards(PermissionGuard)
  @RequirePermission(['UserAdd', 'UserEdit'])
  async assignable() {
    return await this.roleService.assignable();
  }

  /** 获取该角色下可以访问的菜单 */
  @Post('/menu/permission')
  @UseGuards(PermissionGuard)
  @RequirePermission('RolePermission')
  async menuPermission(@Body() dto: RoleMenuDto) {
    return await this.roleService.menuPermission(dto.id);
  }

  /** 编辑该角色下可以访问的菜单 */
  @Post('/menu/permission/edit')
  @UseGuards(PermissionGuard)
  @RequirePermission('RolePermission')
  async menuEdit(@Body() dto: RoleMenuEditDto) {
    return await this.roleService.menuPermissionEdit(dto);
  }
}

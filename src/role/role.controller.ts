import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { BusinessException, JwtGuard, PageDto } from 'src/core';
import { RoleDto, RoleEditDto } from './dto';

const numberParse = (parameter) =>
  new ParseIntPipe({
    exceptionFactory: () => {
      throw new BusinessException(`${parameter} 参数格式错误`);
    },
  });

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /** 获取角色列表 */
  @Post('/list')
  @UseGuards(JwtGuard)
  async list(@Body() dto: PageDto) {
    return await this.roleService.list(dto.page, dto.size);
  }

  /** 新增角色 */
  @Post('/add')
  @UseGuards(JwtGuard)
  async add(@Body() dto: RoleDto) {
    return await this.roleService.add(dto);
  }

  /** 编辑角色 */
  @Post('/edit')
  @UseGuards(JwtGuard)
  async edit(@Body() dto: RoleEditDto) {
    return await this.roleService.edit(dto);
  }

  /** 删除角色 */
  @Get('/delete')
  @UseGuards(JwtGuard)
  async delete(@Query('id', numberParse('id')) id: number) {
    return await this.roleService.delete(id);
  }

  /** 获取可以分配的角色 */
  @Get('/list/assignable')
  async assignable() {
    return await this.roleService.assignable();
  }
}

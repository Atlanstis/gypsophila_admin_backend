import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAddDto, UserEditDto } from './dto';
import { JwtGuard, CommonPageDto, PermissionGuard, RequirePermission } from 'src/core';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 用户列表 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('UserList')
  async list(@Body() dto: CommonPageDto) {
    return this.userService.list(dto.page, dto.size);
  }

  /** 新增用户 */
  @Post('/add')
  @UseGuards(PermissionGuard)
  @RequirePermission('UserAdd')
  async add(@Body() user: UserAddDto) {
    return this.userService.add(user);
  }

  /** 编辑用户 */
  @Post('/edit')
  @UseGuards(PermissionGuard)
  @RequirePermission('UserEdit')
  async edit(@Body() user: UserEditDto) {
    return this.userService.edit(user);
  }

  /** 删除用户 */
  @Get('delete')
  @UseGuards(PermissionGuard)
  @RequirePermission('UserDelete')
  async delete(@Query('id') id: string) {
    return this.userService.delete(id);
  }
}

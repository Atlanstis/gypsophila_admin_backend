import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserAddDto, UserEditDto, UserIdDto } from './dto';
import {
  JwtGuard,
  CommonPageDto,
  PermissionGuard,
  RequirePermission,
} from 'src/core';
import { Request } from 'express';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 用户列表 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission('UserWatch')
  async list(@Body() dto: CommonPageDto) {
    return this.userService.list(dto.page, dto.size);
  }

  /** 新增用户 */
  @Post('/add')
  @UseGuards(PermissionGuard)
  @RequirePermission('UserAdd')
  async add(@Body() dto: UserAddDto) {
    return this.userService.add(dto);
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
  async delete(@Query() dto: UserIdDto, @Req() req: Request) {
    return this.userService.delete(dto.id, req.user.id);
  }
}

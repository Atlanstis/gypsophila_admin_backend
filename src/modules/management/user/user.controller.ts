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
import { UserService } from './user.service';
import { UserAddDto, UserEditDto, UserIdDto } from './dto';
import {
  JwtGuard,
  CommonPageDto,
  PermissionGuard,
  RequirePermission,
  RawData,
  ResponseData,
} from 'src/core';
import { UserAdd, UserDelete, UserEdit, UserWatch } from './constants';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 用户列表 */
  @Post('/list')
  @UseGuards(PermissionGuard)
  @RequirePermission(UserWatch)
  async list(@Body() dto: CommonPageDto, @Req() req: Request) {
    return this.userService.list(dto, req.user);
  }

  /** 新增用户 */
  @Post('/add')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(UserAdd)
  async add(@Body() dto: UserAddDto) {
    await this.userService.add(dto);
    return ResponseData.success(null, '新增成功');
  }

  /** 编辑用户 */
  @Post('/edit')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(UserEdit)
  async edit(@Body() user: UserEditDto) {
    await this.userService.edit(user);
    return ResponseData.success(null, '编辑成功');
  }

  /** 删除用户 */
  @Get('delete')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(UserDelete)
  async delete(@Query() dto: UserIdDto, @Req() req: Request) {
    await this.userService.delete(dto.id, req.user.id);
    return ResponseData.success(null, '删除成功');
  }

  /** 页面配置 */
  @Get('config')
  async config(@Req() req: Request) {
    return await this.userService.getPageConfig(req.user.roleIds);
  }
}

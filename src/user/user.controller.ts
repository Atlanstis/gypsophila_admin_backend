import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PageDto, UserAddDto, UserEditDto } from './dto';
import { JwtGuard } from 'src/core';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 用户列表 */
  @Post('/list')
  @UseGuards(JwtGuard)
  async list(@Body() dto: PageDto) {
    return this.userService.list(dto.page, dto.size);
  }

  /** 新增用户 */
  @Post('/add')
  @UseGuards(JwtGuard)
  async add(@Body() user: UserAddDto) {
    return this.userService.add(user);
  }

  /** 编辑用户 */
  @Post('/edit')
  @UseGuards(JwtGuard)
  async edit(@Body() user: UserEditDto) {
    return this.userService.edit(user);
  }

  /** 删除用户 */
  @Get('delete')
  @UseGuards(JwtGuard)
  async delete(@Query('id') id: string) {
    return this.userService.delete(id);
  }
}

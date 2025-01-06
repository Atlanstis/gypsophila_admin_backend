import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard, RawData, ResponseData } from 'src/core';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** 登录-账号密码 */
  @Post('/login')
  @RawData()
  async login(@Body() user: LoginDto) {
    const res = await this.authService.login(user);
    return ResponseData.success(res, '登录成功');
  }

  /** 用户退出登录 */
  @Get('/logout')
  @UseGuards(JwtGuard)
  @RawData()
  async logOut(@Req() req: Request) {
    const res = await this.authService.logout(req.user.id);
    return ResponseData.success(res, '退出成功');
  }

  /** 重签认证 */
  @Post('/refresh')
  async refresh(@Body() token: RefreshDto) {
    return await this.authService.refresh(token.refreshToken);
  }

  /** 获取已登录用户信息 */
  @Get('/info')
  @UseGuards(JwtGuard)
  async info(@Req() req: Request) {
    return await this.authService.info(req.user.id);
  }
}

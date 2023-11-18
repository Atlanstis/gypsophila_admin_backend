import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshDto } from './dto';
import { JwtGuard } from 'src/core';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** 用户登录 */
  @Post('/login')
  async login(@Body() user: LoginDto) {
    return await this.authService.login(user.username, user.password);
  }

  /** 用户注册 */
  @Post('/register')
  register(@Body() user: RegisterDto) {
    this.authService.register(user.username, user.password);
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
    const { user } = req;
    return await this.authService.info(user.id);
  }
}

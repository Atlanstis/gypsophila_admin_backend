import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PsnService } from './psn.service';
import { PageDto, PsnIdDto } from './dto';
import { Request } from 'express';
import { JwtGuard } from 'src/core';

@Controller('psn')
@UseGuards(JwtGuard)
export class PsnController {
  constructor(private readonly psnService: PsnService) {}

  /** 获取 psn 用户信息 */
  @Get('/profile')
  async getProfile(@Req() req: Request) {
    return await this.psnService.getProfile(req.user.id);
  }

  /** 绑定 psn 用户信息 */
  @Post('/profile/bind')
  async profileBind(@Body() dto: PsnIdDto, @Req() req: Request) {
    return await this.psnService.profileBind(dto.psnId, req.user.id);
  }

  /** 获取可以同步的游戏列表 */
  @Post('/synchronizeable/game')
  async getSynchronizeableGame(@Body() dto: PageDto, @Req() req: Request) {
    return await this.psnService.getSynchronizeableGame(req.user.id, dto.page);
  }
}

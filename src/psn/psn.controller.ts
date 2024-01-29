import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PsnService } from './psn.service';
import { PageDto, PsnIdDto, PsnProfileGameDto, PsnineGameDto } from './dto';
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
  @Post('/game/synchronizeable')
  async getGameSynchronizeable(@Body() dto: PageDto, @Req() req: Request) {
    return await this.psnService.getGameSynchronizeable(req.user.id, dto.page);
  }

  /** 同步游戏 */
  @Post('/game/sync')
  async gameSync(@Body() dto: PsnineGameDto, @Req() req: Request) {
    return await this.psnService.gameSync(req.user.id, dto.gameId);
  }

  /** 获取已经同步的游戏 */
  @Post('/game/synchronized')
  async gameSynchronized(@Body() dto: PageDto, @Req() req: Request) {
    return await this.psnService.gameSynchronized(req.user.id, dto.page);
  }

  /** 收藏/取消收藏 游戏 */
  @Post('/game/favor')
  async gameFavor(@Body() dto: PsnProfileGameDto, @Req() req: Request) {
    return await this.psnService.gameFavor(req.user.id, dto.ppgId);
  }
}

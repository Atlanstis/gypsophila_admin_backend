import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PsnService } from './psn.service';
import { PageDto, PsnIdDto, PsnProfileGameDto, PsnineGameDto } from './dto';
import { Request } from 'express';
import { JwtGuard, PermissionGuard, RequirePermission, CommonPageDto } from 'src/core';

@Controller('psn')
@UseGuards(JwtGuard)
export class PsnController {
  constructor(private readonly psnService: PsnService) {}

  /** 获取 psn 用户信息 */
  @Get('/profile')
  @UseGuards(PermissionGuard)
  @RequirePermission('PsnProfileOperation')
  async getProfile(@Req() req: Request) {
    return await this.psnService.getProfile(req.user.id);
  }

  /** 绑定 psn 用户信息 */
  @Post('/profile/bind')
  @UseGuards(PermissionGuard)
  @RequirePermission('PsnProfileOperation')
  async profileBind(@Body() dto: PsnIdDto, @Req() req: Request) {
    return await this.psnService.profileBind(dto.psnId, req.user.id);
  }

  /** 获取可以同步的游戏列表 */
  @Post('/game/synchronizeable')
  @UseGuards(PermissionGuard)
  @RequirePermission('PsnProfileOperation')
  async getGameSynchronizeable(@Body() dto: PageDto, @Req() req: Request) {
    return await this.psnService.getGameSynchronizeable(req.user.id, dto.page);
  }

  /** 同步游戏 */
  @Post('/game/sync')
  @UseGuards(PermissionGuard)
  @RequirePermission('PsnProfileOperation')
  async gameSync(@Body() dto: PsnineGameDto, @Req() req: Request) {
    return await this.psnService.gameSync(req.user.id, dto.gameId);
  }

  /** 获取已经同步的游戏 */
  @Post('/game/synchronized')
  @UseGuards(PermissionGuard)
  @RequirePermission('PsnProfileOperation')
  async gameSynchronized(@Body() dto: PageDto, @Req() req: Request) {
    return await this.psnService.gameSynchronized(req.user.id, dto.page);
  }

  /** 收藏/取消收藏 游戏 */
  @Post('/game/favor')
  @UseGuards(PermissionGuard)
  @RequirePermission('PsnProfileOperation')
  async gameFavor(@Body() dto: PsnProfileGameDto, @Req() req: Request) {
    return await this.psnService.gameFavor(req.user.id, dto.ppgId);
  }

  /** 获取游戏列表 */
  @Post('/game/list')
  async getGameList(@Body() dto: CommonPageDto) {
    return await this.psnService.getGameList(dto.page, dto.size);
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PsGameService } from './ps-game.service';
import {
  CommonPageDto,
  JwtGuard,
  PermissionGuard,
  RequirePermission,
} from 'src/core';
import { EnumMenuKey } from 'src/constants';

@Controller('ps/game')
@UseGuards(JwtGuard)
export class PsGameController {
  constructor(private readonly psGameService: PsGameService) {}

  /** 游戏列表 */
  @Post('list')
  @RequirePermission(EnumMenuKey.PlayStation_Game, 'menu')
  @UseGuards(PermissionGuard)
  async getGameList(@Body() dto: CommonPageDto) {
    return await this.psGameService.getGameList(dto);
  }
}

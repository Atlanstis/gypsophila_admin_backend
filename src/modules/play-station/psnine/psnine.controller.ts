import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard, PermissionGuard, RequirePermission } from 'src/core';
import { PsnineService } from './psnine.service';
import { EnumMenuKey } from 'src/constants';
import { PsnineGameSearchDto } from './dto';

@Controller('psnine')
@UseGuards(JwtGuard)
export class PsnineController {
  constructor(private readonly psnineService: PsnineService) {}

  /** 游戏查找 */
  @Post('game/search')
  @RequirePermission(EnumMenuKey.PlayStation_Game_Search, 'menu')
  @UseGuards(PermissionGuard)
  async getGameList(@Body() dto: PsnineGameSearchDto) {
    return await this.psnineService.gameSearch(dto);
  }
}

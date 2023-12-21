import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { PsnineService } from './psnine.service';
import { BusinessException, JwtGuard } from 'src/core';
import { GameSearchDto } from './dto';

const numberParse = (parameter) =>
  new ParseIntPipe({
    exceptionFactory: () => {
      throw new BusinessException(`${parameter} 参数错误`);
    },
  });

@Controller('psnine')
@UseGuards(JwtGuard)
export class PsnineController {
  constructor(private readonly psnineService: PsnineService) {}

  @Get('gamelist')
  async getGameList(@Query('page', numberParse('page')) page: number) {
    return await this.psnineService.getGameList(Number(page));
  }

  @Get('/game/trophy')
  async getGameTrophy(@Query('gameId', numberParse('gameId')) gameId: number) {
    return await this.psnineService.getGameTrophy(Number(gameId));
  }

  @Get('/game/topic')
  async getGameTopic(@Query('gameId', numberParse('gameId')) gameId: number) {
    return await this.psnineService.getGameTopic(Number(gameId));
  }

  @Get('/game/rank')
  async getGameRank(@Query('gameId', numberParse('gameId')) gameId: number) {
    return await this.psnineService.getGameRank(gameId);
  }

  /** PSNINE 游戏搜索 */
  @Post('/game/search')
  async gameSearch(@Body() dto: GameSearchDto) {
    return await this.psnineService.gameSearch(dto.keyword, dto.page);
  }
}

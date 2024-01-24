import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { PsnineService } from './psnine.service';
import { BusinessException, JwtGuard } from 'src/core';
import { GameDto, GameRankDto, GameSearchDto } from './dto';

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

  // @Get('/game/trophy')
  // async getGameTrophy(@Query('gameId', numberParse('gameId')) gameId: number) {
  //   return await this.psnineService.getGameTrophy(Number(gameId));
  // }

  /** PSNINE 游戏主题 */
  @Get('/game/topic')
  async getGameTopic(@Query('id', numberParse('id')) id: number) {
    return await this.psnineService.getGameTopic(id);
  }

  /** PSNINE 游戏排行 */
  @Post('/game/rank')
  async getGameRank(@Body() dto: GameRankDto) {
    return await this.psnineService.getGameRank(dto.id, dto.page);
  }

  /** PSNINE 游戏搜索 */
  @Post('/game/search')
  async gameSearch(@Body() dto: GameSearchDto) {
    return await this.psnineService.gameSearch(dto.keyword, dto.page);
  }

  /** PSNINE 游戏详情 */
  @Post('/game/detail')
  async gameDetail(@Body() dto: GameDto) {
    return await this.psnineService.gameDetail(dto.id);
  }
}

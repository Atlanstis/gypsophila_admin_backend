import { Controller, Get, HttpException, ParseIntPipe, Query } from '@nestjs/common';
import { PsnineService } from './psnine.service';

const numberParse = (parameter) =>
  new ParseIntPipe({
    exceptionFactory: () => {
      throw new HttpException(`${parameter} 参数错误`, 200);
    },
  });

@Controller('psnine')
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
}

import { Controller, Get, Query } from '@nestjs/common';
import { PsnineService } from './psnine.service';

@Controller('psnine')
export class PsnineController {
  constructor(private readonly psnineService: PsnineService) {}

  @Get('gamelist')
  async getGameList(@Query('page') page: number) {
    return await this.psnineService.getGameList(Number(page));
  }

  @Get('/game/trophy')
  async getGameTrophy(@Query('gameId') gameId: number) {
    return await this.psnineService.getGameTrophy(Number(gameId));
  }

  @Get('/game/topic')
  async getgameTopic(@Query('gameId') gameId: number) {
    return await this.psnineService.getGameTopic(Number(gameId));
  }
}

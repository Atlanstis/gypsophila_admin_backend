import { Controller, Get, Query } from '@nestjs/common';
import { PsnineService } from './psnine.service';

@Controller('psnine')
export class PsnineController {
  constructor(private readonly psnineService: PsnineService) {}

  @Get('gamelist')
  async getGameList(@Query('page') page: number) {
    return await this.psnineService.getGameList(Number(page));
  }

  @Get('trophy')
  async getTrophy(@Query('gameId') gameId: number) {
    return await this.psnineService.getTrophy(Number(gameId));
  }
}

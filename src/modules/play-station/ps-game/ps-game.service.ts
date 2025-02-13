import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonPageDto } from 'src/core';
import { getSkipTake } from 'src/utils';
import { PsGame } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class PsGameService {
  constructor(
    @InjectRepository(PsGame)
    private readonly psGameRepo: Repository<PsGame>,
  ) {}

  async getGameList(dto: CommonPageDto): Promise<ResPsGame.List> {
    const { take, skip } = getSkipTake(dto.page, dto.size);
    const [list, total] = await this.psGameRepo.findAndCount({
      take,
      skip,
    });
    return {
      list,
      total,
    };
  }
}

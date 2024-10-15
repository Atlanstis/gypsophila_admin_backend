import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/core';
import { MhxyArea } from 'src/entities';
import { Repository } from 'typeorm';
import { AreaDto } from './dto/area.dto';

@Injectable()
export class MhxyAreaService {
  constructor(
    @InjectRepository(MhxyArea)
    private readonly areaRepository: Repository<MhxyArea>,
  ) {}

  async areaAdd(dto: AreaDto) {
    const area = this.areaRepository.create({
      ...dto,
    });
    await this.areaRepository.save(area);
  }

  async areaList() {
    return await this.areaRepository.find({ order: { openDate: 'DESC' } });
  }

  async areaEdit(dto: AreaDto) {
    const area = await this.areaRepository.findOne({
      where: {
        id: dto.id,
      },
    });
    if (!area) {
      throw new BusinessException('当前区服不存在');
    }

    const newArea = this.areaRepository.create({
      ...area,
      ...dto,
    });
    await this.areaRepository.save(newArea);
  }

  async areaDelete(id: number) {
    const area = await this.areaRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!area) {
      throw new BusinessException('当前区服不存在');
    }
    return await this.areaRepository.remove(area);
  }
}

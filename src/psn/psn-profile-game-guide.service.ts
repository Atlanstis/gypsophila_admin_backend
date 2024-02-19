import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/core';
import { PsnProfileGame, PsnProfileGameGuide } from 'src/entities';
import { Repository } from 'typeorm';
import {
  PsnProfileGameDto,
  PsnProfileGameGuideDeleteDto,
  PsnProfileGameGuideDto,
  PsnProfileGameGuideEditDto,
} from './dto';
import { PsnService } from './psn.service';

@Injectable()
export class PsnProfileGameGuideService {
  constructor(
    @InjectRepository(PsnProfileGame)
    private readonly psnProfileGameRepository: Repository<PsnProfileGame>,
    @InjectRepository(PsnProfileGameGuide)
    private readonly psnProfileGameGuideRepository: Repository<PsnProfileGameGuide>,
    private readonly psnService: PsnService,
  ) {}

  /**
   * 添加游戏攻略
   * @param dto 攻略信息
   * @param userId 用户 id
   */
  async profileGameGuideAdd(dto: PsnProfileGameGuideDto, userId: string) {
    const profile = await this.psnService.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    const profileGame = await this.psnProfileGameRepository.findOne({
      where: { id: dto.ppgId, profile: { id: profile.id } },
    });
    if (!profileGame) {
      throw new BusinessException('当前游戏不存在，或者无添加此游戏的权限');
    }
    const ppgg = this.psnProfileGameGuideRepository.create({ ...dto, profileGame });
    await this.psnProfileGameGuideRepository.save(ppgg);
  }

  /**
   * 编辑游戏攻略
   * @param dto 攻略信息
   * @param userId 用户 id
   */
  async profileGameGuideEdit(dto: PsnProfileGameGuideEditDto, userId: string) {
    const profile = await this.psnService.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    const profileGame = await this.psnProfileGameRepository.findOne({
      where: { id: dto.ppgId, profile: { id: profile.id } },
    });
    if (!profileGame) {
      throw new BusinessException('当前游戏不存在，或者无添加此游戏的权限');
    }
    const ppgg = await this.psnProfileGameGuideRepository.findOne({
      where: {
        id: dto.id,
        profileGame: { id: profileGame.id },
      },
    });
    if (!ppgg) {
      throw new BusinessException('当前攻略不存在，或者无修改此攻略的权限');
    }
    const newPpgg = this.psnProfileGameGuideRepository.create({ ...ppgg, ...dto });
    await this.psnProfileGameGuideRepository.save(newPpgg);
  }

  /**
   * 查看游戏攻略列表
   * @param dto 游戏信息
   * @param userId 用户 id
   */
  async profileGameGuideList(dto: PsnProfileGameDto, userId: string) {
    const profile = await this.psnService.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    const profileGame = await this.psnProfileGameRepository.findOne({
      where: { id: dto.ppgId, profile: { id: profile.id } },
    });
    if (!profileGame) {
      throw new BusinessException('当前游戏不存在，或者无查看此游戏的权限');
    }
    return await this.psnProfileGameGuideRepository.find({
      where: { profileGame: { id: profileGame.id } },
    });
  }

  /**
   * 删除游戏攻略列表
   * @param dto 游戏信息
   * @param userId 用户 id
   */
  async profileGameGuideDelete(dto: PsnProfileGameGuideDeleteDto, userId: string) {
    const profile = await this.psnService.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    const profileGame = await this.psnProfileGameRepository.findOne({
      where: { id: dto.ppgId, profile: { id: profile.id } },
    });
    if (!profileGame) {
      throw new BusinessException('当前游戏不存在，或者无操作此游戏的权限');
    }
    const ppgg = await this.psnProfileGameGuideRepository.findOne({
      where: {
        id: dto.id,
        profileGame: { id: profileGame.id },
      },
    });
    if (!ppgg) {
      throw new BusinessException('当前攻略不存在，或者无删除此攻略的权限');
    }
    await this.psnProfileGameGuideRepository.remove(ppgg);
  }
}

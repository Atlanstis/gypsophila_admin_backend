import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/core';
import { PsnProfile } from 'src/entities';
import { PsnineService } from 'src/psnine/psnine.service';
import { FindOptionsRelations, Repository } from 'typeorm';

@Injectable()
export class PsnService {
  constructor(
    @InjectRepository(PsnProfile)
    private readonly psnProfileRepository: Repository<PsnProfile>,
    private readonly psnineService: PsnineService,
  ) {}

  /** 获取 psn 用户信息 */
  async getProfile(id: string) {
    return await this.findProfileByUserId(id);
  }

  /** 绑定 psn 用户信息 */
  async profileBind(psnId: string, id: string) {
    const existPsnId = await this.psnProfileRepository.findOne({ where: { psnId } });
    if (existPsnId) {
      throw new BusinessException('当前 PsnId 已被绑定');
    }
    let profile = await this.findProfileByUserId(id, { user: true });
    if (profile) {
      profile.psnId = psnId;
    } else {
      const { avatar } = await this.psnineService.getProfileDetail(psnId);
      profile = this.psnProfileRepository.create({ psnId, avatar, user: { id } });
    }
    await this.psnProfileRepository.save(profile);
  }

  /**
   * 根据用户 id 获取 psn 信息
   * @param id 用户 id
   * @param relations 关联查询条件
   */
  async findProfileByUserId(id: string, relations: FindOptionsRelations<PsnProfile> = {}) {
    return await this.psnProfileRepository.findOne({
      relations,
      where: {
        user: {
          id,
        },
      },
    });
  }

  /**
   * 获取可以同步的游戏列表
   * @param id 用户 id
   * @param page 页码
   */
  async getSynchronizeableGame(id: string, page: number) {
    const profile = await this.findProfileByUserId(id, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    return await this.psnineService.getPsnineUserGame(profile.psnId, page);
  }
}

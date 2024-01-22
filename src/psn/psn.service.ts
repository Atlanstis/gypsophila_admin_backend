import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PsnProfile } from 'src/entities';
import { PsnineService } from 'src/psnine/psnine.service';
import { Repository } from 'typeorm';

@Injectable()
export class PsnService {
  constructor(
    @InjectRepository(PsnProfile)
    private readonly psnProfileRepository: Repository<PsnProfile>,
    private readonly psnineService: PsnineService,
  ) {}

  /** 获取 psn 用户信息 */
  async getProfile(id: string) {
    return await this.psnProfileRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });
  }

  /** 绑定 psn 用户信息 */
  async profileBind(psnId: string, id: string) {
    let profile = await this.psnProfileRepository.findOne({
      relations: { user: true },
      where: {
        user: {
          id,
        },
      },
    });
    if (profile) {
      profile.psnId = psnId;
    } else {
      const { avatar } = await this.psnineService.getProfileDetail(psnId);
      profile = this.psnProfileRepository.create({ psnId, avatar, user: { id } });
    }
    await this.psnProfileRepository.save(profile);
  }
}

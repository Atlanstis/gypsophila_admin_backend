import { Injectable } from '@nestjs/common';
import { GoldTransferPolicyAddDto, GoldTransferPolicyEditDto } from './dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { MhxyGoldTransferPolicy, MhxyPropCategory } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException, CommonPageDto } from 'src/core';

@Injectable()
export class MhxyGoldTransferPolicyService {
  constructor(
    @InjectRepository(MhxyPropCategory)
    private readonly propCategoryRepository: Repository<MhxyPropCategory>,
    @InjectRepository(MhxyGoldTransferPolicy)
    private readonly policyRepository: Repository<MhxyGoldTransferPolicy>,
    private readonly userService: UserService,
  ) {}

  /** 转金策略-新增 */
  async goldTransferPolicyAdd(dto: GoldTransferPolicyAddDto, userId: string) {
    const propCategory = await this.propCategoryRepository.findOne({
      where: { id: dto.propCategoryId },
    });
    if (!propCategory) {
      throw new BusinessException('道具种类不存在，请重新选择');
    }
    const user = await this.userService.findOneByUser({ id: userId });
    const policy = this.policyRepository.create({ user, propCategory, ...dto });
    await this.policyRepository.save(policy);
  }

  /** 转金策略-编辑 */
  async goldTransferPolicyEdit(dto: GoldTransferPolicyEditDto, userId: string) {
    const policy = await this.policyRepository.findOne({
      where: { id: dto.id, user: { id: userId } },
      relations: { propCategory: true },
    });
    if (!policy) {
      throw new BusinessException('当前策略不存在或者无编辑的权限');
    }
    // 判断是否更新道具种类
    if (dto.propCategoryId !== policy.propCategory.id) {
      const propCategory = await this.propCategoryRepository.findOne({
        where: { id: dto.propCategoryId },
      });
      if (!propCategory) {
        throw new BusinessException('道具种类不存在，请重新选择');
      }
      policy.propCategory = propCategory;
    }
    const newPolicy = this.policyRepository.create({ ...policy, ...dto });
    await this.policyRepository.save(newPolicy);
  }

  /** 转金策略-删除 */
  async goldTransferPolicyDelete(id: number, userId: string) {
    const policy = await this.policyRepository.findOne({
      where: { id: id, user: { id: userId } },
    });
    if (!policy) {
      throw new BusinessException('当前策略不存在或者无编辑的权限');
    }
    await this.policyRepository.remove(policy);
  }

  /** 转金策略-分页 */
  async goldTransferPolicyList(dto: CommonPageDto, userId: string) {
    const { page, size } = dto;
    const [list, total] = await this.policyRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        user: { id: userId },
      },
      relations: {
        propCategory: true,
      },
    });
    return {
      list,
      total,
    };
  }
}

import { Injectable } from '@nestjs/common';
import {
  GoldTransferPolicyAddDto,
  GoldTransferPolicyApplyAddDto,
  GoldTransferPolicyApplyDeleteDto,
  GoldTransferPolicyApplyEditDto,
  GoldTransferPolicyApplyListDto,
  GoldTransferPolicyEditDto,
} from './dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  MhxyAccount,
  MhxyGoldTransferPolicy,
  MhxyGoldTransferPolicyApply,
  MhxyPropCategory,
} from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException, CommonPageDto } from 'src/core';

@Injectable()
export class MhxyGoldTransferPolicyService {
  constructor(
    @InjectRepository(MhxyPropCategory)
    private readonly propCategoryRepository: Repository<MhxyPropCategory>,
    @InjectRepository(MhxyGoldTransferPolicy)
    private readonly policyRepository: Repository<MhxyGoldTransferPolicy>,
    @InjectRepository(MhxyAccount)
    private readonly accountRepository: Repository<MhxyAccount>,
    @InjectRepository(MhxyGoldTransferPolicyApply)
    private readonly policyApplyRepository: Repository<MhxyGoldTransferPolicyApply>,
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
    let policy = await this.policyRepository.findOne({
      where: { propCategory: { id: propCategory.id }, user: { id: userId } },
    });
    if (policy) {
      throw new BusinessException('已为该道具种类添加了策略，请选择其他道具');
    }
    const user = await this.userService.findOneByUser({ id: userId });
    policy = this.policyRepository.create({ user, propCategory, ...dto });
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

  /** 转金策略应用-新增 */
  async goldTransferPolicyApplyAdd(dto: GoldTransferPolicyApplyAddDto, userId: string) {
    const policy = await this.policyRepository.findOne({
      where: { id: dto.policyId, user: { id: userId } },
    });
    if (!policy) {
      throw new BusinessException('当前策略不存在或者无操作的权限');
    }
    const account = await this.accountRepository.findOne({
      where: { id: dto.accountId, user: { id: userId } },
    });
    if (!account) {
      throw new BusinessException('当前账号不存在或者无操作的权限');
    }
    const policyApply = await this.policyApplyRepository.findOne({
      where: { policy: { id: policy.id }, account: { id: account.id } },
    });
    if (policyApply) {
      throw new BusinessException('当前策略已应用到该账号');
    }
    const user = await this.userService.findOneByUser({ id: userId });
    const apply = this.policyApplyRepository.create({
      policy,
      account,
      user,
      ...dto,
    });
    await this.policyApplyRepository.save(apply);
  }

  /** 转金策略应用-编辑 */
  async goldTransferPolicyApplyEdit(dto: GoldTransferPolicyApplyEditDto, userId: string) {
    const apply = await this.policyApplyRepository.findOne({
      where: {
        id: dto.id,
        user: { id: userId },
      },
    });
    if (!apply) {
      throw new BusinessException('当前策略应用不存在，或者无操作的权限');
    }
    const newApply = this.policyApplyRepository.create({
      ...apply,
      ...dto,
    });
    await this.policyApplyRepository.save(newApply);
  }

  /** 转金策略应用-列表 */
  async goldTransferPolicyApplyList(dto: GoldTransferPolicyApplyListDto, userId: string) {
    const { page, size, policyId } = dto;
    const [list, total] = await this.policyApplyRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        policy: { id: policyId },
        user: { id: userId },
      },
      relations: {
        account: true,
      },
    });
    return { list, total };
  }

  /** 转金策略应用-删除 */
  async goldTransferPolicyApplyDelete(dto: GoldTransferPolicyApplyDeleteDto, userId: string) {
    const apply = await this.policyApplyRepository.findOne({
      where: { id: dto.id, user: { id: userId } },
    });
    if (!apply) {
      throw new BusinessException('当前策略应用不存在或者无操作的权限');
    }
    await this.policyApplyRepository.remove(apply);
  }
}

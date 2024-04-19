import { IsNotEmpty, Allow, IsInt, IsIn, Length, Min } from 'class-validator';
import { MHXY_GOLD_TRANSFER_STATUS } from '../constants';
import {
  ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS,
  MHXY_GOLD_TRANSFER_POLICY_LENGTH,
} from 'src/constants';
import { MhxyAccount, MhxyGoldTransferPolicy, MhxyGoldTransferPolicyApply } from 'src/entities';
import { CommonPageDto } from 'src/core';

/** 转金 */
export class GoldTransferDto {
  @IsNotEmpty({ message: 'toAccountId 不能为空' })
  /** 转入账号 id */
  toAccountId: string;
  @IsNotEmpty({ message: 'fromAccountId 不能为空' })
  /** 转出账号 id */
  fromAccountId: string;
  @IsNotEmpty({ message: 'propCategoryId 不能为空' })
  /** 贸易种类 id */
  propCategoryId: number;
  @Allow()
  /** 转出账号金币数 */
  fromNowGold: number;
  @Allow()
  /** 转入账号金币数 */
  toNowGold: number;
  @Allow()
  /** 珍品交易金额 */
  goldAmount: number;
}

/** 查询单个转金信息 */
export class GoldTransferIdDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

export class GoldTransferFinishDto extends GoldTransferIdDto {
  @IsNotEmpty({ message: 'amount 不能为空' })
  @IsInt({ message: 'amount 必须为整数类型' })
  amount: number;
  @IsNotEmpty({ message: 'status 不能为空' })
  @IsIn([MHXY_GOLD_TRANSFER_STATUS.SUCCESS, MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK], {
    message: 'status 错误',
  })
  status: MHXY_GOLD_TRANSFER_STATUS;
}

/** 转金策略-新增 */
export class GoldTransferPolicyAddDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_GOLD_TRANSFER_POLICY_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_GOLD_TRANSFER_POLICY_LENGTH.NAME_MAX} 个字符`,
  })
  name: string;
  @IsNotEmpty({ message: 'quota 不能为空' })
  @IsInt({ message: 'quota 必须为整数类型' })
  @Min(1, { message: 'quota 必须大于 0' })
  quota: number;
  @IsNotEmpty({ message: 'quota 不能为空' })
  @IsInt({ message: 'quota 必须为整数类型' })
  @Min(1, { message: 'quota 必须大于 0' })
  cycleByDay: number;
  @IsNotEmpty({ message: 'propCategoryId 不能为空' })
  propCategoryId: number;
}

/** 转金策略-编辑 */
export class GoldTransferPolicyEditDto extends GoldTransferPolicyAddDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

export class GoldTransferPolicyIdDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

class GoldTransferPolicyApplyDto {
  @IsNotEmpty({ message: 'nextApplyTime 不能为空' })
  nextApplyTime: Date;
  @IsNotEmpty({ message: 'status 不能为空' })
  @IsIn(
    [
      ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.CLOSE,
      ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.OPEN,
    ],
    { message: 'status 类型错误' },
  )
  status: ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS;
}

export class GoldTransferPolicyApplyAddDto extends GoldTransferPolicyApplyDto {
  @IsNotEmpty({ message: 'accountId 不能为空' })
  accountId: MhxyAccount['id'];
  @IsNotEmpty({ message: 'policyId 不能为空' })
  policyId: MhxyGoldTransferPolicy['id'];
}

export class GoldTransferPolicyApplyEditDto extends GoldTransferPolicyApplyDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

export class GoldTransferPolicyApplyListDto extends CommonPageDto {
  @IsNotEmpty({ message: 'policyId 不能为空' })
  policyId: MhxyGoldTransferPolicy['id'];
}

export class GoldTransferPolicyApplyDeleteDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyGoldTransferPolicyApply['id'];
}

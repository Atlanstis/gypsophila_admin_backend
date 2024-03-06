import { Allow, IsIn, IsInt, IsNotEmpty, Length, Min, Validate } from 'class-validator';
import { MHXY_ACCOUNT_GOLD_RECORD_LENGTH, MHXY_ACCOUNT_LENGTH } from 'src/constants';
import { MhxyRoleValidator, MhxySectValidator } from './custom-validation';
import { GoldTransferFinishStatus } from '../constants';

export class MhxyAccountIdDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  @Length(1, MHXY_ACCOUNT_LENGTH.ID_MAX, {
    message: `id 长度为 1 - ${MHXY_ACCOUNT_LENGTH.ID_MAX} 个字符`,
  })
  /** 账号 Id （官方） */
  id: string;
}

/** 账号编辑 */
export class MhxyAccountEditDto extends MhxyAccountIdDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_ACCOUNT_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_ACCOUNT_LENGTH.NAME_MAX} 个字符`,
  })
  /** 账号名称 */
  name: string;

  @IsNotEmpty({ message: 'role 不能为空' })
  @Validate(MhxyRoleValidator, {
    message: `未知的 role`,
  })
  /** 角色 */
  role: string;

  @IsNotEmpty({ message: 'sect 不能为空' })
  @Validate(MhxySectValidator, {
    message: `未知的 sect`,
  })
  /** 门派 */
  sect: string;
}

/** 账号 */
export class MhxyAccountDto extends MhxyAccountEditDto {
  @IsNotEmpty({ message: 'isPrimary 不能为空' })
  /** 是否是主号 */
  isPrimary: boolean;

  @IsNotEmpty({ message: 'gold 不能为空' })
  @IsInt({ message: 'gold 必须为整数' })
  @Min(0, { message: 'gold 必须为大于 0 的数字' })
  /**  金币数量 */
  gold: number;
}

/** 金币收支记录 */
export class GoldRecordDto {
  @IsNotEmpty({ message: 'gold 不能为空' })
  @IsInt({ message: 'gold 必须为整数' })
  nowGold: number;
  @IsNotEmpty({ message: 'accountId 不能为空' })
  accountId: string;
  @IsNotEmpty({ message: 'categoryId 不能为空' })
  categoryId: number;
  @Allow()
  @Length(0, MHXY_ACCOUNT_GOLD_RECORD_LENGTH.REMARK_MAX, {
    message: `remark 最大长度为 ${MHXY_ACCOUNT_GOLD_RECORD_LENGTH.REMARK_MAX}`,
  })
  remark: string;
}

/** 贸易种类查询 */
export class GoldTradeCategorySearchDto {
  /** 是否是转金项 */
  @Allow()
  isTransfer?: boolean;
}

/** 转金 */
export class GoldTransferDto {
  @IsNotEmpty({ message: 'toAccountId 不能为空' })
  /** 转入账号 id */
  toAccountId: string;
  @IsNotEmpty({ message: 'fromAccountId 不能为空' })
  /** 转出账号 id */
  fromAccountId: string;
  @IsNotEmpty({ message: 'categoryId 不能为空' })
  /** 贸易种类 id */
  categoryId: number;
  @Allow()
  /** 转出账号金币数 */
  fromNowGold: number;
  @Allow()
  /** 转入账号金币数 */
  toNowGold: number;
  @Allow()
  /** 珍品交易金额 */
  goldAmount: number;
  @Allow()
  /** 审核所需时间 */
  auditEndHours: number;
}

/** 查询单个转金信息 */
export class GoldTransferInfoDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

export class GoldTransferFinishDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
  @IsNotEmpty({ message: 'amount 不能为空' })
  @IsInt({ message: 'amount 必须为整数类型' })
  amount: number;
  @IsNotEmpty({ message: 'status 不能为空' })
  @IsIn([GoldTransferFinishStatus.SUCCESS, GoldTransferFinishStatus.FAIL_FROM_LOCK], {
    message: 'status 错误',
  })
  status: GoldTransferFinishStatus;
}

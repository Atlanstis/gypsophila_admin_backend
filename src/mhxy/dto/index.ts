export * from './channel.dto';
export * from './gold-record.dto';

import { Allow, IsBoolean, IsIn, IsInt, IsNotEmpty, Length, Min, Validate } from 'class-validator';
import { MHXY_ACCOUNT_LENGTH, MHXY_PROP_CATEGORY_LENGTH } from 'src/constants';
import { MhxyRoleValidator, MhxySectValidator } from './custom-validation';
import { GoldTransferFinishStatus } from '../constants';
import { MhxyPropCategory } from 'src/entities';

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
  @IsInt({ message: 'gold 必须为整数' })
  @Min(0, { message: 'gold 必须为大于 0 的数字' })
  /**  金币数量 */
  gold: number;
  @IsInt({ message: 'lockGold 必须为整数' })
  /**  金币数量 */
  lockGold: number;
}

/** 贸易种类查询 */
export class GoldTradeCategorySearchDto {
  /** 是否是转金项 */
  @Allow()
  isTransfer?: boolean;
}

/** 贸易种类新增 */
export class GoldTradeCategoryAddDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_PROP_CATEGORY_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_PROP_CATEGORY_LENGTH.NAME_MAX} 个字符`,
  })
  /** 种类名称 */
  name: string;
  @IsBoolean({ message: 'isTransfer 类型错误' })
  /** 是否是转金项 */
  isTransfer: boolean;
  @IsBoolean({ message: 'isGem 类型错误' })
  /** 是否是珍品 */
  isGem: boolean;
}

/** 贸易种类编辑 */
export class GoldTradeCategoryEditDto extends GoldTradeCategoryAddDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

/** 贸易种类删除 */
export class GoldTradeCategoryDeleteDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
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

/** 道具种类 */
export class PropCategoryBaseDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_PROP_CATEGORY_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_PROP_CATEGORY_LENGTH.NAME_MAX} 个字符`,
  })
  name: MhxyPropCategory['name'];
  @Allow()
  isGem: boolean;
}

/** 道具种类-新增 */
export class PropCategoryAddDto extends PropCategoryBaseDto {
  @Allow()
  parentId?: MhxyPropCategory['id'];
}

/** 道具种类-编辑 */
export class PropCategoryEditDto extends PropCategoryBaseDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyPropCategory['id'];
}

/** 道具种类-删除 */
export class PropCategoryDeleteDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyPropCategory['id'];
}

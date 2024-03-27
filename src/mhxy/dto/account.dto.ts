import { Allow, IsInt, IsNotEmpty, Length, Min, Validate, IsEnum } from 'class-validator';
import { MHXY_ACCOUNT_KEY_LENGTH, ENUM_MHXY_ACCOUNT_STATUS } from 'src/constants';
import { MhxyRoleValidator, MhxySectValidator } from './custom-validation';

export class MhxyAccountIdDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  @Length(1, MHXY_ACCOUNT_KEY_LENGTH.ID_MAX, {
    message: `id 长度为 1 - ${MHXY_ACCOUNT_KEY_LENGTH.ID_MAX} 个字符`,
  })
  /** 账号 Id （官方） */
  id: string;
}

/** 账号编辑 */
export class MhxyAccountEditDto extends MhxyAccountIdDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_ACCOUNT_KEY_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_ACCOUNT_KEY_LENGTH.NAME_MAX} 个字符`,
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
  @Allow()
  /** 是否是主号 */
  isPrimary: boolean;
  @Allow()
  /** 状态 */
  @IsEnum(ENUM_MHXY_ACCOUNT_STATUS, { message: 'status 不满足要求' })
  status: ENUM_MHXY_ACCOUNT_STATUS;
  @Allow()
  /** 分组 id */
  groupId: number;
  @Allow()
  /** 分组备注  */
  groupRemark: string;
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

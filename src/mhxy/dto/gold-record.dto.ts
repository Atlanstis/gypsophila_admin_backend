import { Allow, IsEnum, IsNotEmpty, Length } from 'class-validator';
import { MHXY_ACCOUNT_GOLD_RECORD_LENGTH } from 'src/constants';
import {
  MHXY_GOLD_RECORD_AMOUNT_TYPE,
  MHXY_GOLD_RECORD_COMPLETE_STATUS,
  MHXY_GOLD_RECORD_STATUS,
  MHXY_GOLD_RECORD_TYPE,
} from '../constants';

/** 金币收支记录 */
export class GoldRecordAddDto {
  /** 账号 id */
  @IsNotEmpty({ message: 'accountId 不能为空' })
  accountId: string;

  /** 途径 id */
  @IsNotEmpty({ message: 'channelId 不能为空' })
  channelId: number;

  /** 道具种类 id */
  @Allow()
  propCategoryId?: number;

  /** 类型 0-按涉及金额、1-按账号现有金币数 */
  @IsEnum(
    [MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT, MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT],
    { message: 'amountType 类型错误' },
  )
  amountType: 0 | 1;

  /** 当前金币数 */
  @Allow()
  nowAmount: number;

  /** 收支类型: expenditure-支出,revenue-收入 */
  @Allow()
  type: MHXY_GOLD_RECORD_TYPE;

  /** 涉及金额 */
  @Allow()
  amount: number;

  /** 状态 */
  @IsEnum([MHXY_GOLD_RECORD_STATUS.COMPLETE, MHXY_GOLD_RECORD_STATUS.IN_PROGRESS], {
    message: 'status 类型错误',
  })
  status: 0 | 1;

  /** 备注 */
  @Allow()
  @Length(0, MHXY_ACCOUNT_GOLD_RECORD_LENGTH.REMARK_MAX, {
    message: `remark 最大长度为 ${MHXY_ACCOUNT_GOLD_RECORD_LENGTH.REMARK_MAX}`,
  })
  remark: string;
}

/** 单个记录  */
export class GoldRecordIdDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

/** 处理未完成的记录 */
export class GoldRecordCompleteDto extends GoldRecordIdDto {
  /** 实际金额 */
  @Allow()
  realAmount: number;

  @IsEnum([MHXY_GOLD_RECORD_COMPLETE_STATUS.COMPLETE, MHXY_GOLD_RECORD_COMPLETE_STATUS.REVOKE], {
    message: 'status 类型错误',
  })
  /** 处理方式 */
  status: 0 | 1;
}

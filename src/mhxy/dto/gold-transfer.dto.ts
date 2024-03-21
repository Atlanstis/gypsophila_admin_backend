import { IsNotEmpty, Allow, IsInt, IsIn } from 'class-validator';
import { MHXY_GOLD_TRANSFER_STATUS } from '../constants';

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

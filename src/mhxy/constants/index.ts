export * from './gold-record';
export * from './channel';
export * from './gold-transfer';

/** 珍品转金完成状态 */
export enum GoldTransferFinishStatus {
  SUCCESS = 'success',
  FAIL_FROM_LOCK = 'fail-from-lock',
}

/** 默认贸易种类 */
export enum DefaultTradeCategory {
  /** 日常 */
  DAILY = 'DAILY',
  /** 金币被锁 */
  GOLD_LOCK = 'GOLD_LOCK',
  /** 金币解锁 */
  GOLD_UNLOCK = 'GOLD_UNLOCK',
}

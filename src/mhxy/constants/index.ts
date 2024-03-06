/** 珍品转金完成状态 */
export enum GoldTransferFinishStatus {
  SUCCESS = 'success',
  FAIL_FROM_LOCK = 'fail-from-lock',
}

/** 默认贸易种类 */
export enum DefaultTradeCategory {
  /** 日常 */
  DAILY = 10001,
  /** 金币被锁 */
  GOLD_LOCK = 10002,
  /** 金币解锁 */
  GOLD_UNLOCK = 10003,
}

/** 金币收支记录，计算方式 */
export enum MHXY_GOLD_RECORD_AMOUNT_TYPE {
  /** 按涉及金额 */
  BY_AMOUNT = 0,
  /** 按账号现有金币数 */
  BY_ACCOUNT_NOW_AMOUNT = 1,
}

/** 金币收支记录，收支类型 */
export enum MHXY_GOLD_RECORD_TYPE {
  /** 支出 */
  EXPENDITURE = 'expenditure',
  /** 收入 */
  REVENUE = 'revenue',
}

/** 金币收支记录，状态 */
export enum MHXY_GOLD_RECORD_STATUS {
  /** 完成 */
  COMPLETE = 1,
  /** 进行中 */
  IN_PROGRESS = 0,
}

/** 收支记录处理操作 */
export const enum MHXY_GOLD_RECORD_COMPLETE_STATUS {
  /** 完成 */
  COMPLETE = 1,
  /** 撤销 */
  REVOKE = 0,
}

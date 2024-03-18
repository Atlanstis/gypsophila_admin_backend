/** 转金状态 */
export enum MHXY_GOLD_TRANSFER_STATUS {
  /** 进行中 */
  PROGRESS = 'progress',
  /** 转金成功 */
  SUCCESS = 'success',
  /** 转金失败，转出账号金币被锁 */
  FAIL_FROM_LOCK = 'fail_from_lock',
}

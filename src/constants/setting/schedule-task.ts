type ScheduleTaskLengthKey = 'KEY_MAX' | 'NAME_MAX' | 'DESCRIPTION_MAX' | 'CYCLE_MAX';

/** 定时任务键长度 */
export const SCHEDULE_TASK_KEY_LENGTH: Record<ScheduleTaskLengthKey, number> = {
  /** 键最大长度 */
  KEY_MAX: 32,
  /** 任务名称最大长度 */
  NAME_MAX: 128,
  /** 描述最大长度 */
  DESCRIPTION_MAX: 512,
  /** 执行周期最大长度 */
  CYCLE_MAX: 32,
};

/** 定时任务状态枚举 */
export enum ENUM_SCHEDULE_TASK_STATUS {
  /** 未生效 */
  INACTIVE = 'inactive',
  /** 已开启 */
  OPEN = 'open',
  /** 执行中 */
  IN_PROGRESS = 'inProgress',
  /** 已关闭 */
  CLOSE = 'close',
}

/** 定时任务日志执行状态枚举 */
export enum ENUM_SCHEDULE_TASK_LOG_STATUS {
  /** 成功 */
  SUCCESS = 'success',
  /** 失败 */
  FAIL = 'fail',
}

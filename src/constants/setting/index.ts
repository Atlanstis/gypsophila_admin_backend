export * from './schedule-task';

type SettingLengthKey = 'KEY_MAX' | 'VALUE_MAX' | 'DESCRIPTION_MAX';

export const SETTING_LENGTH: Record<SettingLengthKey, number> = {
  /** 键最大长度 */
  KEY_MAX: 32,
  /** 值最大长度 */
  VALUE_MAX: 128,
  /** 描述最大长度 */
  DESCRIPTION_MAX: 64,
};
/** 网站名称 */
export const WEBSITE_NAME = 'WEBSITE_NAME';
/** 备案号 */
export const WEBSITE_RECORD_NUMBER = 'WEBSITE_RECORD_NUMBER';
/** 是否显示备案号 */
export const WEBSITE_SHOW_RECORD_NUMBER = 'WEBSITE_SHOW_RECORD_NUMBER';
/** 梦幻西游交易税率(%) */
export const MHXY_TRADE_TAX = 'MHXY_TRADE_TAX';

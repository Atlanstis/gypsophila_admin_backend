export const Const_SystemSetting = {
  keyMin: 2,
  keyMax: 32,
  aliasMin: 2,
  aliasMax: 32,
  valueMax: 128,
  descriptionMax: 64,
};

/** 系统配置类型枚举 */
export enum Enum_SettingType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
}

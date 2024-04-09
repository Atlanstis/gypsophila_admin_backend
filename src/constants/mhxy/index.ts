type MhxyPropCategoryKey = 'NAME_MAX';
type MhxyChannelKey = 'NAME_MAX' | 'KEY_MAX';
type MhxyAccountGoldRecordKey = 'REMARK_MAX';
type MhxyAccountGroupKey = 'NAME_MAX';
type MhxyAccountGroupItemKey = 'REMARK_MAX';

export * from './account';
export * from './gold-transfer';

export const MHXY_ACCOUNT_GOLD_RECORD_LENGTH: Record<MhxyAccountGoldRecordKey, number> = {
  /** 备注最大长度 */
  REMARK_MAX: 256,
};

/** 梦幻道具种类字段长度 */
export const MHXY_PROP_CATEGORY_LENGTH: Record<MhxyPropCategoryKey, number> = {
  /** 名称最大长度 */
  NAME_MAX: 16,
};

/** 梦幻道具种类顶级标识 */
export const MHXY_PROP_CATEGORY_TOP_FLAG = 0;

/** 梦幻途径字段长度 */
export const MHXY_CHANNEL_LENGTH: Record<MhxyChannelKey, number> = {
  /** 名称最大长度 */
  NAME_MAX: 16,
  /** key 最大长度 */
  KEY_MAX: 32,
};
/** 梦幻途径顶级标识 */
export const MHXY_CHANNEL_TOP_FLAG = 0;

/** 梦幻账号分组字段长度 */
export const MHXY_ACCOUNT_GROUP_LENGTH: Record<MhxyAccountGroupKey, number> = {
  /** 名称最大长度 */
  NAME_MAX: 16,
};

/** 梦幻账号分组子项字段长度 */
export const MHXY_ACCOUNT_GROUP_ITEM_LENGTH: Record<MhxyAccountGroupItemKey, number> = {
  /** 备注最大长度 */
  REMARK_MAX: 32,
};

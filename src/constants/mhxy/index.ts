type MhxyAccountKey = 'ID_MAX' | 'NAME_MAX';
type MhxyAccountRole = { label: string; value: string; type: '人' | '魔' | '仙' };
type MhxyAccountSEct = { label: string; value: string };
type MhxyPropCategoryKey = 'NAME_MAX';
type MhxyChannelKey = 'NAME_MAX' | 'KEY_MAX';
type MhxyAccountGoldRecordKey = 'REMARK_MAX';
type MhxyAccountGroupKey = 'NAME_MAX';
type MhxyAccountGroupItemKey = 'REMARK_MAX';

export const MHXY_ACCOUNT_LENGTH: Record<MhxyAccountKey, number> = {
  /** id 最大长度 */
  ID_MAX: 10,
  /** 角色名最大长度 */
  NAME_MAX: 16,
};

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

/** 角色列表 */
export const MHXY_ACCOUNT_ROLE_OPTS: MhxyAccountRole[] = [
  { label: '剑侠客', value: 'jxk', type: '人' },
  { label: '巫蛮儿', value: 'wmr', type: '人' },
  { label: '逍遥生', value: 'xys', type: '人' },
  { label: '飞燕女', value: 'fyn', type: '人' },
  { label: '漠少君', value: 'msj', type: '人' },
  { label: '英女侠', value: 'ynx', type: '人' },
  { label: '越星河', value: 'yxh', type: '人' },
  { label: '龙太子', value: 'ltz', type: '仙' },
  { label: '玄彩娥', value: 'xce', type: '仙' },
  { label: '舞天姬', value: 'wtj', type: '仙' },
  { label: '神天兵', value: 'stb', type: '仙' },
  { label: '羽灵神', value: 'yls', type: '仙' },
  { label: '梦灵珑', value: 'mll-x', type: '仙' },
  { label: '杀破狼', value: 'spl', type: '魔' },
  { label: '骨精灵', value: 'gjl', type: '魔' },
  { label: '虎头怪', value: 'htg', type: '魔' },
  { label: '狐美人', value: 'hmr', type: '魔' },
  { label: '巨魔王', value: 'jmw', type: '魔' },
  { label: '梦灵珑', value: 'mll-m', type: '魔' },
  { label: '喵千岁', value: 'mqs', type: '魔' },
];

/** 门派列表 */
export const MHXY_ACCOUNT_SECT_OPTS: MhxyAccountSEct[] = [
  { label: '大唐官府', value: 'dtgf' },
  { label: '方寸山', value: 'fcs' },
  { label: '狮驼岭', value: 'stl' },
  { label: '普陀山', value: 'pts' },
  { label: '阴曹地府', value: 'ycdf' },
  { label: '龙宫', value: 'lg' },
  { label: '魔王寨', value: 'mwz' },
  { label: '化生寺', value: 'hss' },
  { label: '月宫', value: 'yg' },
  { label: '女儿村', value: 'nec' },
  { label: '小雷音', value: 'xly' },
  { label: '花果山', value: 'hgs' },
  { label: '须弥海', value: 'xmh' },
];

type MhxyAccountKey = 'ID_MAX' | 'NAME_MAX';
type MhxyAccountRoleKey = 'NAME_MAX' | 'AVATAR_MAX';
type MhxyAccountSectKey = 'NAME_MAX' | 'THUMBNAIL_MAX';

export const MHXY_ACCOUNT_LENGTH: Record<MhxyAccountKey, number> = {
  /** id 最大长度 */
  ID_MAX: 10,
  /** 角色名最大长度 */
  NAME_MAX: 16,
};

export const MHXY_ACCOUNT_ROLE_LENGTH: Record<MhxyAccountRoleKey, number> = {
  /** 角色名最大长度 */
  NAME_MAX: 16,
  /** 头像地址最大长度  */
  AVATAR_MAX: 128,
};

export const MHXY_ACCOUNT_SECT_LENGTH: Record<MhxyAccountSectKey, number> = {
  /** 角色名最大长度 */
  NAME_MAX: 16,
  /** 缩略图地址最大长度  */
  THUMBNAIL_MAX: 128,
};

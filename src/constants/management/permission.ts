type permissionKey = 'KEY_MAX' | 'NAME_MAX';

/** 权限各键值长度枚举 */
export const PERMISSION_LENGTH: Record<permissionKey, number> = {
  /** 权限 key 最大长度 */
  KEY_MAX: 32,
  /** 权限名称最大长度 */
  NAME_MAX: 16,
};

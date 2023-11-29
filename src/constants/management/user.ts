type userKey = 'USERNAME_MAX' | 'AVATAR_MAX' | 'PASSWORD_MAX' | 'NICKMAX_MAX';

/** 用户各键值长度枚举 */
export const USER_LENGTH: Record<userKey, number> = {
  /** 用户名最大长度 */
  USERNAME_MAX: 16,
  /** 头像地址最大长度 */
  AVATAR_MAX: 128,
  /** 密码最大长度 */
  PASSWORD_MAX: 128,
  /** 昵称最大长度 */
  NICKMAX_MAX: 10,
};

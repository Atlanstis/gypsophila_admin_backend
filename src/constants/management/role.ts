export enum RoleIsDefaultEnum {
  /** 内置角色 */
  YES = 1,
  /** 非内置角色 */
  NO = 0,
}

type roleKey = 'NAME_MAX';

/** 角色各键值长度枚举 */
export const ROLE_LENGTH: Record<roleKey, number> = {
  /** 用户名最大长度 */
  NAME_MAX: 16,
};

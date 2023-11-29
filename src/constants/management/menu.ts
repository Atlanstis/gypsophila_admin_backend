/** 顶级菜单标识 */
export const TOP_LEVEL_MENU_FLAG = 0;

/** 菜单各键值长度枚举 */

type roleKey = 'KEY_MAX' | 'NAME_MAX';

/** 菜单各键值长度枚举 */
export const MENU_LENGTH: Record<roleKey, number> = {
  /** 菜单 key 最大长度 */
  KEY_MAX: 32,
  /** 菜单 名称 最大长度 */
  NAME_MAX: 16,
};

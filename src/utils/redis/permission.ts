/** Redis-角色权限键 */
export const Key_RolePermission = 'role_permission';

/** Redis-角色菜单键 */
export const Key_RoleMenu = 'role_menu';

/**
 * 将字符串数组转换为集合（Set）。
 * @param strs - 输入的字符串数组。
 * @returns - 包含所有唯一字符串的集合。
 * @example ["['A', 'B]", "['A', 'D]"] -> Set{'A', 'B', 'D'}
 */
export function transformStringArray2Set(strs: string[]) {
  return strs.reduce((set, str) => {
    if (str) {
      try {
        const array = JSON.parse(str);
        array.forEach((item: string) => {
          if (item && !set.has(item)) {
            set.add(item);
          }
        });
      } catch {}
    }
    return set;
  }, new Set<string>());
}

/** Redis-角色权限键 */
export const KeyRolePermission = 'role_permission';

/**
 * 将字符串数组转换为权限集合。
 * @param result 字符串数组，每个元素应能被解析为权限数组
 * @returns 一个包含所有权限的集合。
 */
export function transformRolePermissions(result: string[]) {
  return result.reduce((map, str) => {
    if (str) {
      try {
        const permissions = JSON.parse(str);
        permissions.forEach((permission: string) => map.add(permission));
      } catch {}
    }
    return map;
  }, new Set<string>());
}

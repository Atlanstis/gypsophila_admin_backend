import { Menu, RoleMenuPermission } from 'src/entities';

/**
 * 根据 menuId 聚合 permisionId
 */
export function aggregateMenuPermissions(
  rmps: RoleMenuPermission[],
  menus: Menu[],
) {
  const resultMap = new Map<
    RoleMenuPermission['menuId'],
    RoleMenuPermission['permissionId'][]
  >();
  menus.forEach((menu) => resultMap.set(menu.id, []));

  for (const { menuId, permissionId } of rmps) {
    if (!resultMap.has(menuId)) continue;
    const permissions = resultMap.get(menuId);
    if (permissions && !permissions.includes(permissionId)) {
      permissions.push(permissionId);
    }
  }
  return Array.from(resultMap, ([menuId, permissionIds]) => ({
    menuId,
    permissionIds,
  }));
}

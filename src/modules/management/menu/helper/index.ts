import { Menu } from 'src/entities';
import { execSingleStrategy } from 'src/utils';

/** 组合菜单的操作权限 */
export function combineMenuPermission(
  menu: Menu,
  permission: ResMenu.ConfigPermission,
  children?: ResMenu.MenuListData[],
): ResMenu.MenuListData {
  const menuAddStrategies = [
    // 是否拥有编辑权限
    () => permission.add,
    () => menu.type === 'menu',
  ];
  // 编辑菜单的策略
  const editStrategies = [
    // 是否拥有编辑权限
    () => permission.edit,
    () => menu.type === 'page',
  ];

  // 删除菜单的策略
  const deleteStrategies = [
    // 是否拥有删除权限
    () => permission.delete,
  ];

  // 权限管理的策略
  const permissionStrategies = [
    // 是否拥有权限管理权限
    () => permission.permissionManage,
  ];

  return {
    ...menu,
    children,
    permission: {
      add: execSingleStrategy(menuAddStrategies),
      edit: execSingleStrategy(editStrategies),
      delete: execSingleStrategy(deleteStrategies),
      permissionManage: execSingleStrategy(permissionStrategies),
    },
  };
}

/** 构建菜单权限树 */
export function buildMenuPermissionTree(
  parentId: number,
  allMenus: Menu[],
  permission: ResMenu.ConfigPermission,
): ResMenu.MenuListData[] {
  return allMenus
    .filter((menu) => menu.parentId === parentId)
    .map((menu) => ({
      ...combineMenuPermission(
        menu,
        permission,
        buildMenuPermissionTree(menu.id, allMenus, permission),
      ),
    }));
}

import { PermissionTypeMenu } from 'src/constants';
import { Menu, Permission, RoleMenuPermission } from 'src/entities';

export type MenuBusiness = Omit<Menu, 'createTime' | 'updateTime'> & {
  children?: MenuBusiness[];
};

/** 页面操作权限 */
type MenuOperationPermission = {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canList?: boolean;
  canAllocation?: boolean;
};

/**
 * 处理页面的操作权限
 * @param rmps 权限列表
 * @returns 操作权限
 */
export function getMenuOperationPermission(rmps: RoleMenuPermission[], key: string) {
  const operationPermission: MenuOperationPermission = {};

  const actions: [
    (type: PermissionTypeMenu, permission: Permission, key: string) => boolean,
    () => void,
  ][] = [
    [
      (type) => type === PermissionTypeMenu.Add,
      () => {
        operationPermission.canAdd = true;
      },
    ],
    [
      (type) => type === PermissionTypeMenu.Edit,
      () => {
        operationPermission.canEdit = true;
      },
    ],
    [
      (type) => type === PermissionTypeMenu.List,
      () => {
        operationPermission.canList = true;
      },
    ],
    [
      (type) => type === PermissionTypeMenu.Delete,
      () => {
        operationPermission.canDelete = true;
      },
    ],
    /** 角色管理-是否可以控制权限 */
    [
      (type, permision, key) => key === 'Management_Role' && permision.key === 'RolePermission',
      () => {
        operationPermission.canAllocation = true;
      },
    ],
    /** 菜单管理-是否可以操作权限 */
    [
      (type, permision, key) => key === 'Management_Menu' && permision.key === 'MenuPermission',
      () => {
        operationPermission.canAllocation = true;
      },
    ],
  ];

  rmps.forEach((rmp) => {
    const { type } = rmp.permission;
    actions.some((item) => {
      const [flagFunc, action] = item;
      const flag = flagFunc(type, rmp.permission, key);
      if (flag) {
        action();
      }
      return flag;
    });
  });
  return operationPermission;
}

/**
 * 整理顶级菜单的子菜单
 * @param menus 顶级菜单
 * @param children 子菜单
 * @returns 菜单
 */
export function sortMenuChildren(menus: Menu[], children: MenuBusiness[]) {
  const parents = menus as MenuBusiness[];
  children.forEach((child) => {
    const father = parents.find((menu) => menu.id === child.parentId);
    if (father) {
      if (father.children) {
        father.children.push(child);
      } else {
        father.children = [child];
      }
    }
  });
  return parents;
}

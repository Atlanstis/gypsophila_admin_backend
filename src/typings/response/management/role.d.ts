declare namespace ResRole {
  interface Role {
    id: number;
    name: string;
    desc: string;
    isBuiltin: number;
  }

  interface RoleListData extends Role {
    permission: Pick<ConfigPermission, 'delete' | 'edit' | 'permissionSet'>;
  }

  /** 权限配置 */
  interface ConfigPermission {
    add: boolean;
    delete: boolean;
    edit: boolean;
    watch: boolean;
    permissionSet: boolean;
  }

  /** 页面配置 */
  interface Config {
    permission: ConfigPermission;
  }

  type MenuPermission = {
    list: ResMenu.MenuWithChildren[];
    mps: {
      menuId: number;
      permissionIds: number[];
    }[];
  };
}

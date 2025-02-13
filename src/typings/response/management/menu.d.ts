declare namespace ResMenu {
  interface Menu {
    id: number;
    key: string;
    type: 'page' | 'menu';
    name: string;
    order: number;
    parentId: number | null;
    permissions?: MenuPermission[];
  }

  interface MenuPermission {
    id: number;
    key: string;
    name: string;
    alias: string;
    order: number;
  }

  interface MenuListData extends Menu {
    children?: MenuListData[];
    permission: Pick<
      ConfigPermission,
      'add' | 'delete' | 'edit' | 'permissionManage'
    >;
  }

  /** 权限配置 */
  interface ConfigPermission {
    add: boolean;
    delete: boolean;
    edit: boolean;
    watch: boolean;
    permissionManage: boolean;
  }

  /** 页面配置 */
  interface Config {
    permission: ConfigPermission;
  }
}

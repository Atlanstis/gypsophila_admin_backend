declare namespace ResMenu {
  interface Menu {
    id: number;
    key: string;
    type: 'page' | 'menu';
    name: string;
    order: number;
    parentId: number | null;
    /** 路由路径 */
    path: string;
    /** 图标 */
    icon?: string;
    /** 本地图标 */
    iconLocal?: string;
    /** 视图组件 */
    view?: string;
    /** 布局组件 */
    layout?: string;
    /** 是否缓存 */
    keepAlive?: boolean;
    /** 是否在菜单中隐藏 */
    hideInMenu?: boolean;
    /** 页面激活时，菜单中选中的菜单名 */
    activeMenu?: string;
    permissions?: MenuPermission[];
  }

  type MenuRouteMeta = Pick<
    Menu,
    | 'order'
    | 'type'
    | 'icon'
    | 'iconLocal'
    | 'layout'
    | 'keepAlive'
    | 'hideInMenu'
    | 'activeMenu'
  > & {
    /** 菜单名称 */
    title: Menu['name'];
  };

  type MenuRouteConfig = Pick<Menu, 'path'> & {
    /** 路由名称 */
    name: Menu['key'];
    /** 视图组件 */
    component?: Menu['view'];
    /** 额外信息 */
    meta: MenuRouteMeta;
    /** 子路由 */
    children?: MenuRouteConfig[];
  };

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

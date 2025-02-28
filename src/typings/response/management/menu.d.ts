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
    /** 布局组件 */
    layout?: string;
    /** 是否缓存 */
    keepAlive?: boolean;
    /** 是否在菜单中隐藏 */
    hideInMenu?: boolean;
    /** 页面激活时，菜单中选中的菜单名 */
    activeMenu?: string;
    /** 菜单权限 */
    permissions?: MenuPermission[];
  }

  type MenuWithChildren = Util.RequiredProperty<Menu, 'permissions'> & {
    children: MenuWithChildren[];
  };

  /** 路由元信息 */
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

  /** 路由配置 */
  type MenuRouteConfig = Pick<Menu, 'path'> & {
    /** 路由名称 */
    name: Menu['key'];
    /** 视图组件 */
    component?: Menu['key'];
    /** 额外信息 */
    meta: MenuRouteMeta;
    /** 子路由 */
    children?: MenuRouteConfig[];
  };

  /** 菜单权限 */
  interface MenuPermission {
    id: number;
    key: string;
    name: string;
    alias: string;
    order: number;
  }

  type MenuListData = Omit<Menu, 'permissions'> & {
    children?: MenuListData[];
    permission: Pick<
      ConfigPermission,
      'add' | 'delete' | 'edit' | 'permissionManage'
    >;
  };

  /** 菜单权限配置 */
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

declare namespace ResUser {
  /** 用户数据 */
  interface User {
    id: string;
    nickname: string;
    username: string;
    roles: ResRole.Role[];
  }

  /** 用户列表数据 */
  interface UserListData extends User {
    permission: Pick<ConfigPermission, 'delete' | 'edit'>;
  }

  /** 权限配置 */
  interface ConfigPermission {
    add: boolean;
    delete: boolean;
    edit: boolean;
    watch: boolean;
  }

  /** 页面配置 */
  interface Config {
    permission: ConfigPermission;
  }
}

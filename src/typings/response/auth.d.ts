declare namespace ResAuth {
  /** Token 对象 */
  interface Token {
    /** 访问令牌 */
    accessToken: string;
    /** 刷新令牌 */
    refreshToken: string;
  }

  /** 用户对象 */
  interface User {
    /** 用户 ID */
    id: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 菜单列表 */
    menus: string[];
  }
}

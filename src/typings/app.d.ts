declare namespace App {
  /**
   * jwt payload 信息
   */
  interface JwtPayload {
    username: string;
    id: string;
    roleIds: number[];
  }

  /** 接口访问限制数据 */
  interface PermissionGuardData {
    keys: string[];
    type: 'permission' | 'menu';
  }
}

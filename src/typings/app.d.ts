declare namespace App {
  /**
   * jwt payload 信息
   */
  interface JwtPayload {
    username: string;
    id: string;
    roleIds: number[];
  }
}

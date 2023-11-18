declare namespace App {
  /**
   * jwt payload 信息
   */
  interface JwtPayload {
    username: string;
    id: string;
    type?: 'access_token' | 'refresh_token';
  }
}

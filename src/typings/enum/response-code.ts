/** 自定义返回码 */
export enum ResponseCode {
  /** 执行成功 */
  Success = 0,
  /** 执行错误 */
  Error = -1,
  /** 认证错误，直接前往登录页 */
  Unauthorized = -2,
  /** 认证错误，可以尝试通过 refreshToken 刷新 */
  ReUnauthorized = -3,
}

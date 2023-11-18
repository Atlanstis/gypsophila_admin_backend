import { ResponseCode } from '../enum';

/**
 * 自定义未认证错误
 */
export interface UnauthorizedError {
  code: ResponseCode.Unauthorized | ResponseCode.ReUnauthorized;
  message: string;
}

/** 响应数据 */
export interface ResponseData {
  msg: string;
  data?: any;
  code: ResponseCode;
}

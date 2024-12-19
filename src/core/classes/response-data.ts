/** 响应状态码 */
export const enum ResponseCode {
  /** 访问成功 */
  SUCCESS = 0,
  /** 访问错误 */
  ERROR = -1,
  /** 未认证 */
  UNAUTHORIZED = -2,
  /** 认证过期，需重新认证 */
  RE_UNAUTHORIZED = -3,
}

export class ResponseData {
  constructor(
    public code: ResponseCode,
    public msg?: string,
    public data?: any,
  ) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  /**
   * 返回成功
   * @param data 返回数据
   * @param msg 提示信息
   */
  static success(data?: any, msg: string = '请求成功') {
    return ResponseData.custom(ResponseCode.SUCCESS, data, msg);
  }

  /**
   * 返回失败
   * @param data 返回数据
   * @param msg 提示信息
   */
  static error(data?: any, msg: string = '请求失败') {
    return ResponseData.custom(ResponseCode.ERROR, data, msg);
  }

  /**
   * 返回自定义状态
   * @param data 返回数据
   * @param msg 提示信息
   */
  static custom(code: ResponseCode, data?: any, msg?: string) {
    return new ResponseData(code, msg, data);
  }
}

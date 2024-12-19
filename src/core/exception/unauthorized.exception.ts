import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseCode, ResponseData } from '../classes';
/**
 * 授权出错
 */
export class UnauthorizedException extends HttpException {
  private code;
  constructor(message: string, code: ResponseCode) {
    super(message || '认证出错', HttpStatus.OK);
    this.code = code;
  }

  getResponseData() {
    return ResponseData.custom(this.code, undefined, this.message);
  }
}

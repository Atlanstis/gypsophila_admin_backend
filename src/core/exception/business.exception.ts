import { HttpException, HttpStatus } from '@nestjs/common';
/**
 * 业务异常，自定义返回 200
 */
export class BusinessException extends HttpException {
  constructor(message: string) {
    super(message || '业务出错了', HttpStatus.OK);
  }
}

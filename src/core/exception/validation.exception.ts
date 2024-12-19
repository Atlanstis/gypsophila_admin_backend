import { HttpException, HttpStatus } from '@nestjs/common';
/**
 * 格式验证异常
 */
export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message || '格式验证异常', HttpStatus.OK);
  }
}

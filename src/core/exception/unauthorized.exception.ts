import { HttpException, HttpStatus } from '@nestjs/common';
import { UnauthorizedError } from 'src/typings';
/**
 * 认证异常
 */
export class UnauthorizedException extends HttpException {
  private reason: UnauthorizedError;

  constructor(reason: UnauthorizedError) {
    super(reason.message, HttpStatus.OK);
    this.reason = reason;
  }

  getCustomReponse() {
    return this.reason;
  }
}

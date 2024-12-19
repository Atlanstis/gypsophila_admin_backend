import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResponseData } from '../classes';
@Catch()
/**
 * 捕获所有异常
 */
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 捕获代码报错的异常
    if (exception instanceof TypeError) {
      this.logger.error(exception.message, exception.stack);
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    const data = ResponseData.error(undefined, '程序开小差了(╥_╥)');

    response.status(HttpStatus.OK).json(data);
  }
}

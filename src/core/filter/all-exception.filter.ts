import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';

@Catch()
/**
 * 捕获所有异常
 */
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    // 捕获代码报错的异常
    if (exception instanceof TypeError) {
      this.logger.error(exception.message, exception.stack);
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const responseBody = {
      message: '程序开小差了(╥_╥)',
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(httpStatus);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(responseBody);
  }
}

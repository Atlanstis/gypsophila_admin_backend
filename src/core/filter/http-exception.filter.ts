import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

interface ExcepionResJson {
  message?: string[] | string;
}

/**
 * 拦截 HttpException，并返回统一的数据格式，用于处理业务上的异常。
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    const resJson = exception.getResponse() as ExcepionResJson; // 获取异常内容

    // 设置错误信息
    let message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    if (status === HttpStatus.BAD_REQUEST) {
      // 通过 ValidationPipe 进行参数校验错误时，会抛出 BadRequestException 异常，此处进行捕获，并转换报错信息
      const { message: exceptionMessage } = resJson;
      if (exceptionMessage) {
        message = Array.isArray(exceptionMessage) ? exceptionMessage.join(';') : exceptionMessage;
      }
    }

    if (exception instanceof UnauthorizedException) {
      message = '没有访问的权限';
    }

    const errorResponse = {
      msg: message,
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}

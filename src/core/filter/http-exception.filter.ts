import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UnauthorizedException } from 'src/core';
import { ResponseCode, ResponseData } from 'src/typings';

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
    let status = exception.getStatus(); // 获取异常状态码

    let code = ResponseCode.Error;
    // 设置错误信息
    let message = exception.message;

    if (exception instanceof BadRequestException) {
      const { message: exceptionMessage } = exception.getResponse() as ExcepionResJson;
      // 通过 ValidationPipe 进行参数校验错误时，会抛出 BadRequestException 异常，此处进行捕获，并转换报错信息
      if (exceptionMessage) {
        message = Array.isArray(exceptionMessage) ? exceptionMessage.join(';') : exceptionMessage;
        // 修改状态码
        status = HttpStatus.OK;
      }
    }

    // 处理认证失败的情况
    if (exception instanceof UnauthorizedException) {
      const customException = exception.getCustomReponse();
      message = customException.message;
      code = customException.code;
    }

    const errorResponse: ResponseData = {
      msg: message,
      code: code,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}

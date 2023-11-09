import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

/**
 * 对成功返回的数据，进行包裹，进行格式统一
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse();
    // Nestjs 中 POST 请求默认的响应码为 201，此处将之修改为 200
    if (response.statusCode === HttpStatus.CREATED && response.req.method === 'POST') {
      response.status(HttpStatus.OK);
    }
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          msg: '请求成功',
        };
      }),
    );
  }
}

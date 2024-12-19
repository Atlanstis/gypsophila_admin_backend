import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { type Response } from 'express';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { IS_RAW_DATA, ResponseData } from 'src/core';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse();
    // Nestjs 中 POST 请求默认的响应码为 201，此处将之修改为 200
    if (
      response.statusCode === HttpStatus.CREATED &&
      response.req.method === 'POST'
    ) {
      response.status(HttpStatus.OK);
    }

    const isRawData = this.reflector.getAllAndOverride<boolean>(IS_RAW_DATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    return next.handle().pipe(
      map((data) => {
        return isRawData ? data : ResponseData.success(data);
      }),
    );
  }
}

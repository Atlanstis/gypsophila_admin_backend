import { type INestApplication } from '@nestjs/common';

import { TransformInterceptor } from './transform.interceptor';
import { Reflector } from '@nestjs/core';

export function setupInterceptor(app: INestApplication) {
  // 对返回数据进行统一拦截
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
}

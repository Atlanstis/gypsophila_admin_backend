import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, TransformInterceptor, AllExceptionsFilter } from './core';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { ENV_VARS } from './enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 成功返回数据时，对内容进行包裹
  app.useGlobalInterceptors(new TransformInterceptor());
  // 注册全局错误的过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  // 参数校验
  app.useGlobalPipes(new ValidationPipe());
  // 替换 Logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER) as LoggerService;
  app.useLogger(logger);

  // 获取端口
  const configService = app.get(ConfigService);
  const port = configService.get(ENV_VARS.PORT);

  await app.listen(port);

  logger.log(`Application is running on: ${port}`, 'APP');
}

bootstrap();

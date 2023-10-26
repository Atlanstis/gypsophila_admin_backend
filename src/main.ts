import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, TransformInterceptor } from './core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 成功返回数据时，对内容进行包裹
  app.useGlobalInterceptors(new TransformInterceptor());
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 参数校验
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();

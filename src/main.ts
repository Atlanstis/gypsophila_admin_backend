import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { setupFilter, setupInterceptor, setupPipe } from './core';
import { TypedConfigService } from './modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 替换 Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger = new Logger();

  // 注册拦截器
  setupInterceptor(app);

  // 注册过滤器
  setupFilter(app, logger);

  // 注册管道
  setupPipe(app);

  // 获取端口
  const configService = app.get(TypedConfigService);
  const port = configService.get('port');

  await app.listen(port);

  // 打印启动信息
  logger.log(`Application is running on: ${port}`, 'APP');
}

bootstrap();

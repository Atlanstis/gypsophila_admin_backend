import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '../exception';

export function setupPipe(app: INestApplication) {
  // 配置自动验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      // 校验出错时，默认抛出 BadRequestException，这里改为抛出自定义的 ValidationException
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints || {}).map(
            (constraint) => constraint,
          ),
        );
        return new ValidationException(messages.join('；'));
      },
    }),
  );
}

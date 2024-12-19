export * from './http-exception.filter';
export * from './all-exception.filter';

import { type INestApplication, type Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { AllExceptionsFilter } from './all-exception.filter';

export function setupFilter(app: INestApplication, logger: Logger) {
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new HttpExceptionFilter(),
  );
}

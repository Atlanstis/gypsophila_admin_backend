import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './redis.module-definition';
import { RedisService } from './redis.service';
import { TypedConfigService } from '..';

@Module({
  providers: [RedisService, TypedConfigService],
  exports: [RedisService],
})
export class RedisModule extends ConfigurableModuleClass {}

import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN, RedisModuleOptions } from './redis.module-definition';
import { createClient, RedisClientType } from 'redis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: RedisModuleOptions,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.initRedis(options);
  }

  private async initRedis(options) {
    try {
      this.client = createClient({
        socket: {
          ...options,
        },
      });
      await this.client.connect();
    } catch (e) {
      this.logger.error(e, 'Redis Client Error');
      throw e;
    }
    this.logger.log('Redis client connected', 'Redis');
  }

  async set(key: string, value: string) {
    try {
      await this.client.set(key, value);
    } catch (e) {
      this.logger.error(e, 'Redis');
    }
  }

  async get(key: string): Promise<any> {
    try {
      return this.client.get(key);
    } catch (e) {
      this.logger.error(e, 'Redis');
    }
  }

  /**
   * 获取 redis 实例
   * @returns redis 实例
   */
  getClient() {
    return this.client;
  }
}

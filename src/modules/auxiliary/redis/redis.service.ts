import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  MODULE_OPTIONS_TOKEN,
  RedisModuleOptions,
} from './redis.module-definition';
import { createClient, RedisClientType, SetOptions } from 'redis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: RedisModuleOptions,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.initRedis();
  }

  private async initRedis() {
    try {
      this.client = createClient({
        socket: {
          ...this.options,
        },
      });
      await this.client.connect();
      this.logger.log('Redis client connected', 'Redis');
    } catch (e) {
      this.logger.error(e, 'Redis Client Error');
      throw e;
    }
  }

  /**
   * 设置带有过期时间的值
   * @param key 键
   * @param value 值
   * @param expire 过期时间（单位：秒）
   */
  async setWithExpire(key: string, value: string, expire: number) {
    await this.set(key, value, { EX: expire });
    this.logger.log(
      `key: ${key},value: ${value}, expireInSeconds: ${expire} s`,
      'Redis set',
    );
  }

  async set(key: string, value: string, config: SetOptions = {}) {
    try {
      await this.client.set(key, value, config);
    } catch (e) {
      this.logger.error(e, 'Redis');
    }
  }

  async get<T>(key: string): Promise<any> {
    try {
      return (await this.client.get(key)) as T;
    } catch (e) {
      this.logger.error(e, 'Redis');
    }
  }

  async del(key: string) {
    try {
      return this.client.del(key);
    } catch (e) {
      this.logger.error(e, 'Redis');
    }
  }

  /** 设置哈希表 */
  async setHash(hashKey: string, field: string, value: string) {
    try {
      await this.client.hSet(hashKey, field, value);
      this.logger.log(
        `hashKey: ${hashKey},field: ${field}, value: ${value}`,
        'Redis hSet',
      );
    } catch (e) {
      this.logger.error(e, 'Redis');
    }
  }

  /** 获取哈希表 */
  async getHash(hashKey: string, field: string) {
    try {
      return await this.client.hGet(hashKey, field);
    } catch (e) {
      this.logger.error(e, 'Redis');
    }
  }

  /** 批量设置哈希表 */
  async setHashes(hashKey: string, data: [string, string][]) {
    try {
      const promises = data.map(([field, value]) =>
        this.setHash(hashKey, field, value),
      );
      await Promise.all(promises);
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

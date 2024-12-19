import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './typing';

@Injectable()
export class TypedConfigService extends ConfigService<Configuration> {
  get<K extends keyof Configuration>(key: K): Configuration[K];
  get<K extends keyof Configuration, T extends keyof Configuration[K]>(
    key: K,
    subKey: T,
  ): Configuration[K][T];

  get<K extends keyof Configuration, T extends keyof Configuration[K]>(
    key: K,
    subKey?: T,
  ): Configuration[K] | Configuration[K][T] {
    const config = super.get<Configuration[K]>(key);
    if (subKey) {
      if (config && typeof config === 'object') {
        return (config as Configuration[K])[subKey];
      }
      throw new Error(
        `Invalid subKey: ${String(subKey)} for config key: ${String(key)}`,
      );
    }
    return config;
  }
}

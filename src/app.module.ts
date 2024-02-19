import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsnineModule } from './psnine/psnine.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './utils/config';
import * as Joi from 'joi';
import { ENV_VARS } from './enum';
import { LogModule } from './log/log.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { SettingModule } from './setting/setting.module';
import { ormConfig } from 'ormconfig';
import { PsnModule } from './psn/psn.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      /** 全局注册配置模块 */
      isGlobal: true,
      /** 忽略默认的配置文件 */
      ignoreEnvFile: true,
      /** 自定义加载配置文件 */
      load: [config],
      /** 校验 NODE_ENV 参数 */
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
      }),
    }),
    TypeOrmModule.forRoot(ormConfig),
    RedisModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<Environment.RedisConfig>(ENV_VARS.REDIS);
        return {
          ...redisConfig,
          isGlobal: true,
        };
      },
    }),
    LogModule,
    PsnineModule,
    AuthModule,
    UserModule,
    RoleModule,
    MenuModule,
    SettingModule,
    PsnModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

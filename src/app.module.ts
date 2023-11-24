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
import { Menu, Role, User } from './entities';
import { RedisModule } from './redis/redis.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mysqlConfig = configService.get<Environment.MysqlConfig>(ENV_VARS.MYSQL);
        return {
          type: 'mysql',
          ...mysqlConfig,
          logging: true,
          entities: [User, Role, Menu],
          poolSize: 10,
          dateStrings: true,
        };
      },
    }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

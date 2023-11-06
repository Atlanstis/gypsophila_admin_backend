import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsnineModule } from './psnine/psnine.module';
import { PsGame } from './entities/ps-game.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './utils/config';
import * as Joi from 'joi';
import { ENV_VARS, MysqlConfig } from './enum';

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
        const mysqlConfig = configService.get(ENV_VARS.MYSQL) as MysqlConfig;
        return {
          type: 'mysql',
          ...mysqlConfig,
          logging: true,
          entities: [PsGame],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
            timezone: 'Asia/Shanghai',
          },
        };
      },
    }),
    PsnineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

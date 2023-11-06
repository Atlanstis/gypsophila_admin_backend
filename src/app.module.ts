import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsnineModule } from './psnine/psnine.module';
import { PsGame } from './entities/ps-game.entity';
import { ConfigModule } from '@nestjs/config';
import config from './utils/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      /** 全局注册配置模块 */
      isGlobal: true,
      /** 忽略默认的配置文件 */
      ignoreEnvFile: true,
      /** 自定义加载配置文件 */
      load: [config],
      /** 检验 NODE_ENV 参数 */
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'j!Y6hTwR',
      database: 'gypsophila',
      synchronize: true,
      logging: true,
      entities: [PsGame],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
        timezone: 'Asia/Shanghai',
      },
    }),
    PsnineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PsnineModule } from './psnine/psnine.module';
import { ConfigModule } from '@nestjs/config';
import config from './utils/config';
import * as Joi from 'joi';
import {
  AuthModule,
  UserModule,
  RoleModule,
  MenuModule,
  RedisModule,
  LogModule,
  TypedConfigService,
} from './modules';
import { ormConfig } from 'ormconfig';
import { AppService } from './app.service';
// import { SettingModule } from './setting/setting.module';
// import { PsnModule } from './psn/psn.module';
// import { ScheduleTaskModule } from './schedule-task/schedule-task.module';
// import { NoticeModule } from './notice/notice.module';

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
      inject: [TypedConfigService],
      useFactory: (configService: TypedConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          ...redisConfig,
          isGlobal: true,
        };
      },
    }),
    LogModule,
    AuthModule,
    UserModule,
    RoleModule,
    MenuModule,
    // PsnineModule,
    // SettingModule,
    // PsnModule,
    // ScheduleTaskModule,
    // NoticeModule,
  ],
  controllers: [],
  providers: [AppService, TypedConfigService],
  exports: [],
})
export class AppModule {}

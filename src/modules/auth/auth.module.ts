import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { ENV_VARS } from 'src/enum';
import { Role, User, UserAuthMethod } from 'src/entities';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_VARS.JWT_SECRET),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TypeOrmModule.forFeature([Role, User, UserAuthMethod]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

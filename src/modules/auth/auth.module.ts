import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User, UserAuthMethod } from 'src/entities';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypedConfigService } from 'src/modules';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: TypedConfigService) => {
        const secret = configService.get('jwt', 'secret');
        return {
          secret,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Role, User, UserAuthMethod]),
  ],
  providers: [AuthService, TypedConfigService],
  controllers: [AuthController],
})
export class AuthModule {}

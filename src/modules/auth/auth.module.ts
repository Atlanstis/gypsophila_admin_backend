import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User, UserAuthMethod } from 'src/entities';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwt = configService.get<{ secret: string }>('jwt');
        return {
          secret: jwt.secret,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Role, User, UserAuthMethod]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

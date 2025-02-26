import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, UserAuthMethod, Menu } from 'src/entities';
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
      extraProviders: [TypedConfigService],
      inject: [TypedConfigService],
    }),
    TypeOrmModule.forFeature([Role, UserAuthMethod, Menu]),
  ],
  providers: [AuthService, TypedConfigService],
  controllers: [AuthController],
})
export class AuthModule {}

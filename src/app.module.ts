import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PsnineModule } from './psnine/psnine.module';
import { PsGame } from './entities/ps-game.entity';

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

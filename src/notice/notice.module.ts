import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
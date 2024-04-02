import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { ScheduleTaskController } from './schedule-task.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleTask, ScheduleTaskLog } from 'src/entities';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([ScheduleTask, ScheduleTaskLog])],
  controllers: [ScheduleTaskController],
  providers: [ScheduleTaskService],
})
export class ScheduleTaskModule {}

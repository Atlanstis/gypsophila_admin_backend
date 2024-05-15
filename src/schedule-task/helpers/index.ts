import { LoggerService } from '@nestjs/common';
import { Task } from '../typings';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { ScheduleTask, ScheduleTaskLog } from 'src/entities';
import { ENUM_SCHEDULE_TASK_LOG_STATUS, ENUM_SCHEDULE_TASK_STATUS } from 'src/constants';
import { SchedulerRegistry } from '@nestjs/schedule';
import { roundToDecimal } from 'src/utils';

export function removeTaskJob(task: ScheduleTask, schedulerRegistry: SchedulerRegistry) {
  try {
    const job = schedulerRegistry.getCronJob(task.key);
    if (job) {
      job.stop();
      schedulerRegistry.deleteCronJob(task.key);
    }
  } catch (e) {
    console.log(e);
  }
}

/** 包裹执行任务 */
export function packExecuteTask(
  task: Task,
  scheduleTask: ScheduleTask,
  logger: LoggerService,
  dataSource: DataSource,
  schedulerRegistry: SchedulerRegistry,
) {
  return async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    const log = queryRunner.manager.create(ScheduleTaskLog, {
      scheduleTask,
      executionTime: new Date(),
    });
    const lastStatus = scheduleTask.status;
    const startTime = dayjs();
    try {
      scheduleTask.status = ENUM_SCHEDULE_TASK_STATUS.IN_PROGRESS;
      await queryRunner.manager.save(scheduleTask);
      logger.log(`${scheduleTask.key} task executed`);
      const result = await task.execute(logger, queryRunner);
      log.status = ENUM_SCHEDULE_TASK_LOG_STATUS.SUCCESS;
      log.result = result;
      scheduleTask.lastRunTime = new Date();
      scheduleTask.status = lastStatus;
    } catch (e) {
      log.status = ENUM_SCHEDULE_TASK_LOG_STATUS.FAIL;
      log.result = e.toString();
      scheduleTask.status = ENUM_SCHEDULE_TASK_STATUS.CLOSE;
      removeTaskJob(scheduleTask, schedulerRegistry);
      throw e;
    } finally {
      const endTime = dayjs();
      const consumingTime = roundToDecimal(endTime.diff(startTime) / 1000);
      logger.log(`${scheduleTask.key} task executed in ${consumingTime}s`);
      log.consumingTime = consumingTime;
      await queryRunner.manager.save(scheduleTask);
      await queryRunner.manager.save(log);
      await queryRunner.release();
    }
  };
}

import { LoggerService } from '@nestjs/common';
import { ENUM_TASK } from '../constants';
import { QueryRunner } from 'typeorm';

export interface Task {
  /** 任务 key */
  key: ENUM_TASK;
  /** 执行任务函数 */
  execute: (logger: LoggerService, queryRunner: QueryRunner) => Promise<string>;
}

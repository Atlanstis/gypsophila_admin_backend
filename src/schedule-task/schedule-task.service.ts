import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CronJob } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BusinessException, CommonPageDto } from 'src/core';
import { ScheduleTask, ScheduleTaskLog } from 'src/entities';
import { ENUM_SCHEDULE_TASK_STATUS } from 'src/constants';
import { TASKS_LIST } from './task';
import { packExecuteTask, removeTaskJob } from './helpers';
import { ScheduleTaskDto, ScheduleTaskIdDto } from './dto';
import { Task } from './typings';

@Injectable()
export class ScheduleTaskService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(ScheduleTask)
    private readonly taskRepository: Repository<ScheduleTask>,
    @InjectRepository(ScheduleTaskLog)
    private readonly taskLogRepository: Repository<ScheduleTaskLog>,
    private dataSource: DataSource,
  ) {
    logger.log('Task Schedule Service Initialized');
    this.initTasks();
  }

  /** 定时任务-列表 */
  async list(dto: CommonPageDto) {
    const { page, size } = dto;
    const [list, total] = await this.taskRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });
    return { list, total };
  }
  async taskCommonCheck(dto: ScheduleTaskDto) {
    const task = await this.taskRepository.findOne({
      where: { key: dto.key },
    });
    if (!task) {
      throw new BusinessException('当前任务不存在');
    }
    if (task.status === ENUM_SCHEDULE_TASK_STATUS.IN_PROGRESS) {
      throw new BusinessException('当前任务正在进行中，请稍后再试');
    }
    const handlerTask = TASKS_LIST.find((item) => item.key === task.key);
    if (task.status === ENUM_SCHEDULE_TASK_STATUS.INACTIVE || !handlerTask) {
      throw new BusinessException('当前任务还没配置，请在后台进行处理');
    }
    return {
      task,
      handlerTask,
    };
  }

  /** 定时任务-关闭 */
  async close(dto: ScheduleTaskDto) {
    const { task } = await this.taskCommonCheck(dto);
    if (task.status === ENUM_SCHEDULE_TASK_STATUS.CLOSE) {
      throw new BusinessException('当前任务已关闭，请勿重复操作');
    }
    removeTaskJob(task, this.schedulerRegistry);
    task.status = ENUM_SCHEDULE_TASK_STATUS.CLOSE;
    await this.taskRepository.save(task);
  }

  /** 定时任务-开启 */
  async open(dto: ScheduleTaskDto) {
    const { task, handlerTask } = await this.taskCommonCheck(dto);
    if (task.status === ENUM_SCHEDULE_TASK_STATUS.OPEN) {
      throw new BusinessException('当前任务已开启，请勿重复操作');
    }
    removeTaskJob(task, this.schedulerRegistry);
    this.addTaskJob(task, handlerTask, this.schedulerRegistry);
    task.status = ENUM_SCHEDULE_TASK_STATUS.OPEN;
    await this.taskRepository.save(task);
  }

  /** 定时任务-立即执行 */
  async execute(dto: ScheduleTaskDto) {
    const { task, handlerTask } = await this.taskCommonCheck(dto);
    const execute = packExecuteTask(
      handlerTask,
      task,
      this.logger,
      this.dataSource,
      this.schedulerRegistry,
    );
    await execute();
  }

  /** 定时任务-执行日志-列表 */
  async logList(dto: ScheduleTaskIdDto) {
    const { page, size, taskId } = dto;
    const [list, total] = await this.taskLogRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        scheduleTask: {
          id: taskId,
        },
      },
    });
    return {
      list,
      total,
    };
  }

  /** 启动时，初始化任务 */
  async initTasks() {
    const list = await this.taskRepository.find();
    list.forEach((task) => {
      const handlerTask = TASKS_LIST.find((item) => item.key === task.key);
      if (!handlerTask) {
        // 数据库中的 task 未与代码中相匹配，将状态置为未生效
        if (task.status !== ENUM_SCHEDULE_TASK_STATUS.INACTIVE) {
          this.taskRepository.update(task.id, { status: ENUM_SCHEDULE_TASK_STATUS.INACTIVE });
        }
        return;
      }
      if (task.status === ENUM_SCHEDULE_TASK_STATUS.OPEN) {
        // 配置为开启的任务，定时执行
        this.addTaskJob(task, handlerTask, this.schedulerRegistry);
      } else if (task.status === ENUM_SCHEDULE_TASK_STATUS.INACTIVE) {
        // 未生效的任务，状态置为未开启
        this.taskRepository.update(task.id, { status: ENUM_SCHEDULE_TASK_STATUS.CLOSE });
      }
    });
  }

  /** 将任务添加进定时管理器 */
  addTaskJob(task: ScheduleTask, handlerTask: Task, schedulerRegistry: SchedulerRegistry) {
    const job = new CronJob(
      task.cycle,
      packExecuteTask(handlerTask, task, this.logger, this.dataSource, this.schedulerRegistry),
    );
    schedulerRegistry.addCronJob(task.key, job);
    job.start();
  }
}

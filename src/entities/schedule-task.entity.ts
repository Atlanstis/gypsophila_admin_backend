import { ENUM_SCHEDULE_TASK_STATUS, SCHEDULE_TASK_KEY_LENGTH } from '../constants';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ScheduleTaskLog } from './schedule-task-log.entity';

@Entity({ name: 'schedule_task' })
export class ScheduleTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '任务唯一标识', length: SCHEDULE_TASK_KEY_LENGTH.KEY_MAX })
  key: string;

  @Column({ comment: '任务名称', length: SCHEDULE_TASK_KEY_LENGTH.NAME_MAX })
  name: string;

  @Column({ comment: '任务描述', length: SCHEDULE_TASK_KEY_LENGTH.DESCRIPTION_MAX, nullable: true })
  description: string;

  @Column({ comment: '执行周期', length: SCHEDULE_TASK_KEY_LENGTH.CYCLE_MAX })
  cycle: string;

  @Column({
    comment: '任务状态',
    type: 'enum',
    enum: ENUM_SCHEDULE_TASK_STATUS,
    default: ENUM_SCHEDULE_TASK_STATUS.INACTIVE,
  })
  status: ENUM_SCHEDULE_TASK_STATUS;

  @Column({ comment: '上次执行时间', name: 'last_run_time', type: 'timestamp', nullable: true })
  lastRunTime: Date;

  @OneToMany(() => ScheduleTaskLog, (log) => log.scheduleTask)
  logs: ScheduleTaskLog[];
}

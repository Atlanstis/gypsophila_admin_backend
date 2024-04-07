import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ScheduleTask } from './schedule-task.entity';
import { ENUM_SCHEDULE_TASK_LOG_STATUS } from '../../constants';

@Entity({ name: 'schedule_task_log', orderBy: { executionTime: 'DESC' } })
export class ScheduleTaskLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '执行时间', name: 'execution_time', type: 'timestamp' })
  executionTime: Date;

  @Column({ comment: '耗时(秒)', name: 'consuming_time', type: 'int' })
  consumingTime: number;

  @Column({
    comment: '执行状态',
    type: 'enum',
    enum: ENUM_SCHEDULE_TASK_LOG_STATUS,
    default: ENUM_SCHEDULE_TASK_LOG_STATUS.SUCCESS,
  })
  status: ENUM_SCHEDULE_TASK_LOG_STATUS;

  @Column({ comment: '执行结果', type: 'text' })
  result: string;

  @ManyToOne(() => ScheduleTask, (scheduleTask) => scheduleTask.logs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'schedule_task_id' })
  scheduleTask: ScheduleTask;
}

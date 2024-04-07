import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { CommonPageDto } from 'src/core';
import { ScheduleTaskDto, ScheduleTaskIdDto } from './dto';

@Controller('schedule-task')
export class ScheduleTaskController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}

  /** 定时任务-列表 */
  @Post('/list')
  async list(@Body() dto: CommonPageDto) {
    return await this.scheduleTaskService.list(dto);
  }

  /** 定时任务-立即执行 */
  @Post('/execute')
  async execute(@Body() dto: ScheduleTaskDto) {
    return await this.scheduleTaskService.execute(dto);
  }

  /** 定时任务-关闭 */
  @Post('/close')
  async close(@Body() dto: ScheduleTaskDto) {
    return await this.scheduleTaskService.close(dto);
  }

  /** 定时任务-开启 */
  @Post('/open')
  async open(@Body() dto: ScheduleTaskDto) {
    return await this.scheduleTaskService.open(dto);
  }

  /** 定时任务-执行日志-列表 */
  @Post('/log/list')
  async logList(@Body() dto: ScheduleTaskIdDto) {
    return await this.scheduleTaskService.logList(dto);
  }
}

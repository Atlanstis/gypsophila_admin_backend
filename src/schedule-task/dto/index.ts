import { IsNotEmpty } from 'class-validator';
import { CommonPageDto } from 'src/core';

export class ScheduleTaskDto {
  @IsNotEmpty({ message: 'key 不能为空' })
  key: string;
}

export class ScheduleTaskIdDto extends CommonPageDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  taskId: number;
}

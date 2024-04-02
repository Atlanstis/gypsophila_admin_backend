import { IsNotEmpty } from 'class-validator';

export class ScheduleTaskDto {
  @IsNotEmpty({ message: 'key 不能为空' })
  key: string;
}

import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class PsnineGameSearchDto {
  @IsNotEmpty({ message: 'title 不能为空' })
  title: string;

  @Min(0, { message: 'page 最小为1' })
  @IsInt({ message: 'page 格式错误' })
  @IsNotEmpty({ message: 'page 不能为空' })
  page: number;
}

import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class PageDto {
  @IsNotEmpty({ message: '请输入 page' })
  @IsInt({ message: 'page 必须为数字' })
  @Min(1, { message: 'page 必须大于 1' })
  page: number;
  @IsNotEmpty({ message: '请输入 size' })
  @IsInt({ message: 'size 必须为数字' })
  @Min(1, { message: 'size 必须大于 1' })
  size: number;
}

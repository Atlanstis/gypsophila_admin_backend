import { IsNotEmpty, IsInt, Min } from 'class-validator';

/** 分页 Dto */
export class CommonPageDto {
  @Min(1, { message: 'page 必须大于 1' })
  @IsInt({ message: 'page 必须为数字' })
  @IsNotEmpty({ message: '请输入 page' })
  page: number;

  @Min(1, { message: 'size 必须大于 1' })
  @IsInt({ message: 'size 必须为数字' })
  @IsNotEmpty({ message: '请输入 size' })
  size: number;
}

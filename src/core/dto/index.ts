import { IsNotEmpty } from 'class-validator';

export class PageDto {
  @IsNotEmpty({ message: '请输入 page' })
  page: number;
  @IsNotEmpty({ message: '请输入 size' })
  size: number;
}

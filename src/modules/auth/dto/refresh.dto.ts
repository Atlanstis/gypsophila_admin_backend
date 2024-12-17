import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  /** refreshToken */
  @IsNotEmpty({ message: '请传入 refreshToken' })
  refreshToken: string;
}

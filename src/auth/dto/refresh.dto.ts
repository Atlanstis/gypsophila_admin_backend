import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  /** refreshToken */
  @IsNotEmpty()
  refreshToken: string;
}

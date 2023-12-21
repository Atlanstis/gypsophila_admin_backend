import { Allow } from 'class-validator';

export class GameSearchDto {
  @Allow()
  /** 关键字 */
  keyword: string;
  /** 页码 */
  @Allow()
  page?: number;
}

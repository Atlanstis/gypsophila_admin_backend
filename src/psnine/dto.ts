import { Allow, IsNotEmpty, IsInt } from 'class-validator';

export class GameSearchDto {
  @IsNotEmpty({ message: '搜索关键字不能为空' })
  /** 关键字 */
  keyword: string;
  /** 页码 */
  @Allow()
  page?: number;
}

export class GameDto {
  @IsNotEmpty({ message: '游戏 Id 不能为空' })
  @IsInt({ message: '游戏 Id 必须为数字' })
  id: number;
}

export class GameRankDto {
  @IsNotEmpty({ message: '游戏 Id 不能为空' })
  @IsInt({ message: '游戏 Id 必须为数字' })
  id: number;
  /** 页码 */
  @Allow()
  page?: number;
}

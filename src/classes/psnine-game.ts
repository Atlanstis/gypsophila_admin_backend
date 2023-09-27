/**平台信息 */
export type Platform = 'PS3' | 'PSV' | 'PS4' | 'PS5';

/** 奖杯信息 */
export type Trophy = {
  /** 白金奖杯数 */
  platinum: number;
  /** 金奖杯数 */
  gold: number;
  /** 银奖杯数 */
  silver: number;
  /** 铜奖杯数 */
  bronze: number;
};

export class PsnineGame {
  /** psnine 游戏 id */
  id: number;
  /** 游戏名称 */
  name: string;
  /** 游戏原名 */
  originName: string;
  /** 上架平台 */
  platforms: Platform[];
  /** 缩略图 */
  thumbnail: string;
  /** 最后奖杯获取时间 */
  lastTrophyTime: string;
  /** 已用时间 */
  usedTime: string;
  /** psnine url */
  url: string;
  /** 完美难度 */
  difficulty: string;
  /** 游戏进度 */
  perfectRate: number;
  /** 完成进度 */
  progress: number;
  /** 获得奖杯数 */
  trophyGot: Trophy;
}

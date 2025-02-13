declare namespace PsnineM {
  /** 完美困难度 */
  type PerfectDifficulty = '极易' | '容易' | '普通' | '麻烦' | '困难' | '地狱';

  /** PSNINE 游戏信息 */
  interface Game {
    /** id */
    id: number;
    /** url*/
    url: string;
    /** 名称 */
    name: string;
    /* 原名 */
    originName: string;
    /** 缩略图 */
    thumbnail: string;
    /** 上线平台 */
    platforms: PlayStation.Platform[];
    /** 完美难度 */
    perfectDifficulty: PerfectDifficulty;
    /** 完美率 */
    perfectRate: number;
    /** 游玩人数 */
    players: number;
    /** 版本 */
    version: string[];
    /** 白金奖杯数 */
    platinum: number;
    /** 金奖杯数 */
    gold: number;
    /** 银奖杯数 */
    silver: number;
    /** 铜奖杯数 */
    bronze: number;
  }
}

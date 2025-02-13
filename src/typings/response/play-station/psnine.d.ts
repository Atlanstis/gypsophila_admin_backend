declare namespace Psnine {
  /** 完美困难度 */
  type PerfectDifficulty = '极易' | '容易' | '普通' | '麻烦' | '困难' | '地狱';

  /** PSNINE 游戏信息 */
  type Game = {
    /** psnine 游戏 id */
    id: number;
    /** psnine url */
    url: string;
    /** 完美难度 */
    perfectDifficulty: PerfectDifficulty;
    /** 完美率 */
    perfectRate: number;
    /** 版本 */
    version: string[];
  } & PlayStation.TrophyNum;

  /** PSNINE 奖杯信息 */
  type Trophy = Omit<PlayStation.Trophy, 'id'> & {
    /** 奖杯 id */
    id: number;
    /** 详情地址 */
    url: string;
    /** 提示数量 */
    tipNum: number;
    /** 完成率 */
    completeRate: number;
    /** 玩家完成时间 */
    completeTime: string;
    /** 是否完成 */
    complete: boolean;
  };

  type GameCrawler = Partial<Omit<PlayStation.Game, 'id'> & Game>;

  type ProfileGameCrawler = Partial<
    GameCrawler & {
      /** 完成进度 */
      progress: number;
      /** 获得奖杯数 */
      trophyGot: PlayStation.TrophyNum;
    }
  >;

  type TrophyGroupCrawler = Partial<
    Omit<PlayStation.TrophyGroup, 'id' | 'trophies'> & {
      trophies: TrophyCrawler[];
    }
  >;

  type TrophyCrawler = Partial<Trophy>;
}

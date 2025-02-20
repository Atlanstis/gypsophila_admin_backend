declare namespace Psnine {
  /** 完美困难度 */
  type PerfectDifficulty =
    | '神作'
    | '极易'
    | '容易'
    | '普通'
    | '麻烦'
    | '困难'
    | '噩梦'
    | '地狱';

  /** 游戏-基础类 */
  interface Game {
    /** id */
    id: number;
    /** url*/
    url: string;
    /** 名称 */
    name: string;
    /* 原名 */
    originName: string;
    /** 缩略图地址 */
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

  /** 搜索-游戏 */
  type SearchGameItem = Omit<Game, 'originName'>;

  /** 用户游戏列表-游戏 */
  type ProfileGameItem = Omit<Game, 'players'> & {
    /** 完成进度 */
    progress: number;
  };

  /** 详情-游戏 */
  type GameDetail = Omit<Game, 'players'> & {
    /**奖杯组 */
    trophyGroups: TrophyGroup[];
  };

  interface TrophyGroup {
    /** 名称 */
    name: string;
    /** 缩略图地址 */
    thumbnail: string;
    /** 白金奖杯数 */
    platinum: number;
    /** 金奖杯数 */
    gold: number;
    /** 银奖杯数 */
    silver: number;
    /** 铜奖杯数 */
    bronze: number;
    /** 奖杯信息 */
    trophies: Trophy[];
  }

  /** 奖杯 */
  interface Trophy {
    /** 奖杯 Id */
    id: number;
    /** 详情地址 */
    url: string;
    /** 奖杯名称 */
    name: string;
    /** 奖杯类型 */
    type: PlayStation.TrophyType;
    /** 奖杯图标 */
    thumbnail: string;
    /** 奖杯描述 */
    description: string;
    /** 奖杯顺序 */
    order: number;
    /** 提示数量 */
    tipNum: number;
    /** 完成率 */
    completeRate: number;
    /** 玩家完成时间 */
    completeTime: string;
    /** 是否完成 */
    complete: boolean;
  }
}

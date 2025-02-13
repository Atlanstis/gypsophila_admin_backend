declare namespace PlayStation {
  /** 用户信息 */
  type Profile = {
    /** PSN ID */
    psnId: string;
    /** 头像地址 */
    avatar: string;
  } & TrophyNum;

  /** 奖杯数量信息 */
  type TrophyNum = {
    /** 白金奖杯数 */
    platinum: number;
    /** 金奖杯数 */
    gold: number;
    /** 银奖杯数 */
    silver: number;
    /** 铜奖杯数 */
    bronze: number;
  };

  /** 奖杯类型 */
  type TrophyType = keyof TrophyNum;

  /** 平台信息 */
  type Platform = 'PS3' | 'PSV' | 'PS4' | 'PS5';

  /** 游戏信息 */
  type Game = {
    id: number;
    /** 游戏名称 */
    name: string;
    /** 游戏原名 */
    originName: string;
    /** 缩略图 */
    thumbnail: string;
    /** 上线平台 */
    platforms: PlayStation.Platform[];
    /** psnine 信息 */
    psnine?: GamePsnine;
    /** 奖杯组 */
    trophyGroups?: TrophyGroup[];
  } & TrophyNum;

  interface GamePsnine {
    id: number;
    url: string;
  }

  /** 用户游玩游戏信息 */
  type ProfileGame = {
    id: number;
    /** 同步时间 */
    syncTime: Date;
    /** 游戏信息 */
    game?: Game;
  } & TrophyNum;

  /** 已获得奖杯 */
  type ProfileTrophy = {
    completeTime: string;
    id: number;
    screenshot?: string;
    video?: string;
    trophyId: number;
  };

  /** 奖杯组 */
  type TrophyGroup = {
    id: number;
    /** 奖杯组名称 */
    name: string;
    /** 缩略图 */
    thumbnail: string;
    /** 奖杯信息 */
    trophies?: Trophy[];
  } & TrophyNum;

  /** 奖杯 */
  interface Trophy {
    /** 奖杯 Id */
    id: number;
    /** 奖杯名称 */
    name: string;
    /** 奖杯类型 */
    type: TrophyType;
    /** 奖杯图标 */
    thumbnail: string;
    /** 奖杯描述 */
    description: string;
    /** 奖杯顺序 */
    order: number;
  }
}

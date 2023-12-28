/**平台信息 */
export type Platform = 'PS3' | 'PSV' | 'PS4' | 'PS5';

/** 完美困难度 */
export type PerfectDifficulty = '极易' | '容易' | '普通' | '麻烦' | '困难' | '地狱';

/** 奖杯数量信息 */
export type TrophyNum = {
  /** 白金奖杯数 */
  platinum: number;
  /** 金奖杯数 */
  gold: number;
  /** 银奖杯数 */
  silver: number;
  /** 铜奖杯数 */
  bronze: number;
};
// /** Ps 游戏 */
// export class PsnineGame {
//   /** psnine 游戏 id */
//   id: number;
//   /** 游戏名称 */
//   name: string;
//   /** 游戏原名 */
//   originName: string;
//   /** 上架平台 */
//   platforms: Platform[];
//   /** 缩略图 */
//   thumbnail: string;
//   /** 最后奖杯获取时间 */
//   lastTrophyTime: string;
//   /** 已用时间 */
//   usedTime: string;
//   /** psnine url */
//   url: string;
//   /** 完美难度 */
//   difficulty: PerfectDifficulty;
//   /** 游戏进度 */
//   perfectRate: number;
//   /** 完成进度 */
//   progress: number;
//   /** 获得奖杯数 */
//   trophyGot: TrophyNum;
// }

// /** 奖杯组 */
// export class PsTrophyGroup {
//   /** 游戏 id */
//   gameId: number;
//   /** 奖杯组名称 */
//   name: string;
//   /** 缩略图 */
//   thumbnail: string;
//   /** 奖杯数量信息 */
//   trophyNum: TrophyNum;
//   /** 是否 DLC */
//   isDLC: boolean;
//   /** 奖杯信息 */
//   trophies: PsTrophy[];
// }

// /** 讨论信息 */
// export class PsTopic {
//   /** 标题 */
//   title: string;
//   /** 详细地址 */
//   url: string;
//   /** 发布时间 */
//   publicationTime: string;
//   /** 讨论数 */
//   discussTimes: number;
// }

// /** 游玩排名信息 */
// export class PsGameRank {
//   /** 排名顺序 */
//   index: number;
//   /** 完成时间 */
//   completionTime: string;
//   /** 完成进度 */
//   completionRate: string;
//   /** 使用时间 */
//   usedTime: string;
// }

/** 奖杯 */
export class PsTrophy {
  /** 奖杯名称 */
  name: string;
  /** 奖杯类型 */
  trophyType: 'platinum' | 'gold' | 'silver' | 'bronze';
  /** 奖杯图标 */
  thumbnail: string;
  /** 奖杯描述 */
  description: string;
  /** 奖杯顺序 */
  order: number;
}

export class PsnineTrophy extends PsTrophy {
  /** 奖杯 id */
  psnineId: number;
  /** 提示数量 */
  tipNums: number;
  /** 完成率 */
  complateRate: number;
}

export class PsTrophyGroup {
  /** 奖杯组名称 */
  name: string;
  /** 缩略图 */
  thumbnail: string;
  /** 奖杯数量信息 */
  trophyNum: TrophyNum;
  /** 是否 DLC */
  isDLC: boolean;
  /** 奖杯信息 */
  trophies: PsTrophy[];
}

export class PSGame {
  /** 游戏名称 */
  name: string;
  /** 游戏原名 */
  originName: string;
  /** 缩略图 */
  thumbnail: string;
  /** 上线平台 */
  platforms: Platform[];
  /** 奖杯数量 */
  trophyNum: TrophyNum;
}

export class PsnineSearchGame extends PSGame {
  /** psnine 游戏 id */
  id: number;
  /** 详细地址 */
  url: string;
  /** 完美难度 */
  perfectDiffucuity: PerfectDifficulty;
  /** 完美率  */
  perfectRate: number;
  /** 游玩人数 */
  players: number;
  /** 版本 */
  version: string[];
}

export class PsnineGame extends PSGame {
  /** psnine 游戏 id */
  id: number;
  /** psnine 地址 */
  url: string;
  /** 完美难度 */
  perfectDiffucuity: PerfectDifficulty;
  /** 完美率 */
  perfectRate: number;
  /** 游玩人数 */
  players: number;
  /** 版本 */
  version: string[];
  /** 奖杯组信息 */
  trophyGroup: PsTrophyGroup[];
}
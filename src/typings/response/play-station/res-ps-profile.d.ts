/** /ps/profile/ 接口返回数据 */
declare namespace ResPsProfile {
  /** PS 用户信息 */
  type Info = Util.Nullable<PlayStation.Profile>;

  /** 用户在 PSNINE 上同步的游戏信息 */
  type PsnineGame = Psnine.ProfileGameItem & {
    /** 是否在本系统中已同步 */
    isSync: boolean;
  };

  /** 用户在 PSNINE 上同步的游戏列表 */
  type PsnineGameList = ResCommon.TableData<PsnineGame>;

  /** 用户游戏列表 */
  type GameList = ResCommon.TableData<PlayStation.ProfileGame>;

  /** 游戏概览数据 */
  type GameInfo = {
    game: PlayStation.Game;
    profileGame: PlayStation.ProfileGame;
    profileTrophies: PlayStation.ProfileTrophy[];
  };
}

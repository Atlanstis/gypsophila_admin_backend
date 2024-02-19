type PsnProfileLengthKey = 'PSN_ID_MAX' | 'AVATAR_MAX';

type psnProfileGameGuideLengthKey = 'TITLE_MAX' | 'URL_MAX';

export const PSN_PROFILE_LENGTH: Record<PsnProfileLengthKey, number> = {
  /** psnId 最大长度 */
  PSN_ID_MAX: 32,
  /** 头像地址最大长度 */
  AVATAR_MAX: 128,
};

export const PSN_PROFILE_GAME_GUIDE_LENGTH: Record<psnProfileGameGuideLengthKey, number> = {
  /** 标题最大长度 */
  TITLE_MAX: 64,
  /** 地址最大长度 */
  URL_MAX: 128,
};

/** 游戏攻略类型枚举 */
export enum PSN_PROFILE_GAME_GUIDE_TYPE_ENUM {
  /** 链接 */
  URL = 'url',
  /** 文本内容 */
  TEXT = 'text',
}

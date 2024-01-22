type PSNProfileLengthKey = 'PSN_ID_MAX' | 'AVATAR_MAX';

export const PSN_PROFILE_LENGTH: Record<PSNProfileLengthKey, number> = {
  /** psnId 最大长度 */
  PSN_ID_MAX: 32,
  /** 头像地址最大长度 */
  AVATAR_MAX: 128,
};

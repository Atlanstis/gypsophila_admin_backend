import { type JwtService } from '@nestjs/jwt';

export const AccessTokenKey = 'access_key_';
export const RefreshTokenKey = 'refresh_key_';

/**
 * 创建 JWT 令牌
 * @param jwtService - JWT 服务实例
 * @param payload - 包含用户信息的 JWT 负载
 * @param expiresIn - 令牌过期时间（秒）
 * @returns - 返回生成的 JWT 令牌
 */
export function createJwt(
  jwtService: JwtService,
  payload: App.JwtPayload,
  expiresIn: number,
) {
  return jwtService.sign(payload, { expiresIn });
}

/**
 * 获取存入 Redis 的 JWT key
 * @param userId - 用户 ID
 * @param key - 令牌类型，可以是 'access' 或 'refresh'
 * @returns - 返回生成的 JWT key
 */
export function getJwtRedisKey(userId: string, key: 'access' | 'refresh') {
  const suffix = key === 'access' ? AccessTokenKey : RefreshTokenKey;
  return `${suffix}${userId}`;
}

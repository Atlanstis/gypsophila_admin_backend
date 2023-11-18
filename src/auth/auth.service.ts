import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { BusinessException, UnauthorizedException } from 'src/core';
import { UserService } from 'src/user/user.service';
import { RedisService } from 'src/redis/redis.service';
import { ResponseCode } from 'src/typings';

/** access Token 过期时间 */
const ACCESS_TOKEN_EXPIRE_SECONDS = 5 * 60;
/** refresh Token 过期时间 */
const REFRESH_TOKEN_EXPIRE_SECONDS = 30 * 60;
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new BusinessException('用户名不存在');
    }
    const isValid = await argon.verify(user.password, password);
    if (isValid) {
      return await this.registerToken(username, user.id);
    }
    throw new BusinessException('用户名或密码错误');
  }

  register(username: string, password: string) {
    console.log('🚀 ~ file: auth.service.ts:14 ~ AuthService ~ register ~ password:', password);
    console.log('🚀 ~ file: auth.service.ts:15 ~ AuthService ~ username:', username);
  }

  /**
   * token 重签
   * @param token token
   * @returns { refreshToken, accessToken }
   */
  async refresh(token: string) {
    const error = new UnauthorizedException({
      code: ResponseCode.Unauthorized,
      message: '请重新登录',
    });
    if (!token) {
      throw error;
    }
    let payload: App.JwtPayload;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw error;
    }
    const cachetoken = await this.redisService.get<string>(`refresh_token-${payload.id}`);
    if (!cachetoken || cachetoken !== token) {
      throw error;
    }
    payload = {
      id: payload.id,
      username: payload.username,
    };
    return await this.registerToken(payload.username, payload.id);
  }

  /**
   * 根据 payload 生成 token
   * @param username 用户名
   * @param id 用户id
   * @returns token 对象
   */
  async registerToken(username: string, id: string) {
    const payload: App.JwtPayload = { username, id };
    const accessToken = await this.jwtService.signAsync(
      {
        ...payload,
        type: 'access_token',
      },
      { expiresIn: ACCESS_TOKEN_EXPIRE_SECONDS },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
        type: 'refresh_token',
      },
      { expiresIn: REFRESH_TOKEN_EXPIRE_SECONDS },
    );
    this.redisService.setWithExpire(`access_token-${id}`, accessToken, ACCESS_TOKEN_EXPIRE_SECONDS);
    this.redisService.setWithExpire(
      `refresh_token-${id}`,
      refreshToken,
      REFRESH_TOKEN_EXPIRE_SECONDS,
    );
    return { refreshToken, accessToken };
  }
}

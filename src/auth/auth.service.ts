import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { BusinessException, UnauthorizedException } from 'src/core';
import { UserService } from 'src/user/user.service';
import { RedisService } from 'src/redis/redis.service';
import { ResponseCode } from 'src/typings';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities';

/** access Token 过期时间 */
const ACCESS_TOKEN_EXPIRE_SECONDS = 5 * 60 * 10;
/** refresh Token 过期时间 */
const REFRESH_TOKEN_EXPIRE_SECONDS = 30 * 60 * 10;
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns 认证信息
   */
  async login(username: string, password: string) {
    const user = await this.userService.findOneByUser({ username });
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
   * 获取已登录用户信息
   * @param id 用户 Id
   */
  async info(id: string) {
    // 查找用户信息
    const { username, avatar, nickname, roles } = await this.userService.findOneByUser(
      { id },
      { id: true, username: true, avatar: true, nickname: true },
      { roles: true },
    );
    // 根据用户权限，获取菜单
    const roleIds = roles.map((role) => role.id);
    const userRoles = await this.roleRepository.find({
      where: { id: In(roleIds) },
      relations: {
        menus: true,
      },
    });
    const menus = new Set<string>();
    userRoles.forEach((role) => {
      role.menus.forEach((menu) => {
        menus.add(menu.key);
      });
    });
    return { id, username, avatar, nickname, roles: roleIds, menus: Array.from(menus) };
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

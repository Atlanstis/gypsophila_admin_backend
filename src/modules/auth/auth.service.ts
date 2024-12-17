import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { BusinessException, UnauthorizedException } from 'src/core';
import { UserService } from 'src/modules/user/user.service';
import { RedisService } from 'src/redis/redis.service';
import { ResponseCode } from 'src/typings';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthMethodTypeEnum,
  Role,
  RoleStateEnum,
  User,
  UserAuthMethod,
} from 'src/entities';
import { ConfigService } from '@nestjs/config';
import { ENV_VARS } from 'src/enum';
import { getTokenKeyName } from './helper';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto';
import { hybridDecrypt } from 'src/utils';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserAuthMethod)
    private readonly userAuthMethodRepo: Repository<UserAuthMethod>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 用户登录
   */
  async login(dto: LoginDto) {
    // 查询是否存在密码登录方式
    const userAuthMethod = await this.userAuthMethodRepo.findOne({
      where: {
        methodType: AuthMethodTypeEnum.password,
        user: { username: dto.username },
      },
      relations: { user: true },
    });
    const errorMsg = '用户名或密码错误';
    if (!userAuthMethod) throw new BusinessException(errorMsg);

    // 验证密码是否正确
    const passwordDecrypted = hybridDecrypt(
      dto.password.data,
      dto.password.key,
      dto.password.iv,
    );
    const valid = await argon.verify(
      userAuthMethod.password,
      passwordDecrypted,
    );
    if (!valid) throw new BusinessException(errorMsg);
    const { id, username } = userAuthMethod.user;
    const roles = await this.roleRepo.findBy({ users: { id } });
    return await this.registerToken(
      username,
      id,
      roles.map((role) => role.id),
    );
  }

  /**
   * 用户退出登录
   * @param id 用户id
   */
  async logout(id: string) {
    const accessToken = getTokenKeyName(id, 'access_token');
    const refreshToken = getTokenKeyName(id, 'refresh_token');
    await this.redisService.del(accessToken);
    await this.redisService.del(refreshToken);
    return null;
  }

  /**
   * token 重签
   * @param token token
   * @returns { refreshToken, accessToken }
   */
  async refresh(token: string) {
    const error = new UnauthorizedException({
      code: ResponseCode.Unauthorized,
      message: '认证已失效，请重新登录',
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
    const cachetoken = await this.redisService.get<string>(
      `refresh_token-${payload.id}`,
    );
    if (!cachetoken || cachetoken !== token) {
      throw error;
    }
    return await this.registerToken(
      payload.username,
      payload.id,
      payload.roleIds,
    );
  }

  /**
   * 获取已登录用户信息
   * @param id 用户 Id
   */
  async info(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    // 根据用户权限，获取菜单
    // 获取授权菜单
    const roles = await this.roleRepo.find({
      where: { users: { id: user.id }, state: RoleStateEnum.active },
      relations: {
        menus: true,
      },
    });
    const menus = new Set<string>();
    roles.forEach((role) => {
      role.menus.forEach((menu) => {
        menus.add(menu.key);
      });
    });
    return {
      ...user,
      menus: Array.from(menus),
    };
  }

  /**
   * 根据 payload 生成 token
   * @param username 用户名
   * @param id 用户id
   * @returns token 对象
   */
  async registerToken(username: string, id: string, roleIds: number[]) {
    const { accessExpire, refreshExpire } = this.configService.get<{
      accessExpire: number;
      refreshExpire: number;
    }>(ENV_VARS.TokenExpire);
    const payload: App.JwtPayload = { username, id, roleIds };
    const accessToken = await this.jwtService.signAsync({
      ...payload,
      uuid: uuidv4(),
    });
    const refreshToken = await this.jwtService.signAsync({
      ...payload,
      uuid: uuidv4(),
    });
    this.redisService.setWithExpire(
      getTokenKeyName(id, 'access_token'),
      accessToken,
      accessExpire,
    );
    this.redisService.setWithExpire(
      getTokenKeyName(id, 'refresh_token'),
      refreshToken,
      refreshExpire,
    );
    return { refreshToken, accessToken };
  }
}

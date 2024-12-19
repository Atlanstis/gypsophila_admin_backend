import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import {
  BusinessException,
  UnauthorizedException,
  ResponseCode,
} from 'src/core';
import { RedisService, TypedConfigService } from 'src/modules';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthMethodTypeEnum,
  Role,
  RoleStateEnum,
  User,
  UserAuthMethod,
} from 'src/entities';
import { LoginDto } from './dto';
import { createJwt, getJwtRedisKey, hybridDecrypt } from 'src/utils';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserAuthMethod)
    private readonly userAuthMethodRepo: Repository<UserAuthMethod>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: TypedConfigService,
  ) {}

  /**
   * 登录-账号密码
   * @param dto - 包含用户名和密码的登录信息
   * @returns - 返回生成的 JWT 令牌
   * @throws {BusinessException} - 如果用户名或密码错误，则抛出业务异常
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

    // 未查询到相应的密码信息，则抛出业务异常
    const errorMsg = '用户名或密码错误';
    if (!userAuthMethod) throw new BusinessException(errorMsg);

    // 解密传输过来的密码数据
    const passwordDecrypted = hybridDecrypt(
      dto.password.data,
      dto.password.key,
      dto.password.iv,
    );
    // 验证密码是否正确
    const valid = await argon.verify(
      userAuthMethod.password,
      passwordDecrypted,
    );

    // 如果密码不正确，则抛出业务异常
    if (!valid) throw new BusinessException(errorMsg);

    // 生成并返回 JWT 令牌
    const { id, username } = userAuthMethod.user;
    const roles = await this.roleRepo.findBy({ users: { id } });
    const payload: App.JwtPayload = {
      id: userAuthMethod.user.id,
      username,
      roleIds: roles.map((role) => role.id),
    };
    return await this.registerToken(payload);
  }

  /**
   * 用户退出登录
   * @param id 用户 ID
   */
  async logout(id: string) {
    // 获取访问令牌和刷新令牌的 Redis 键
    const accessToken = getJwtRedisKey(id, 'access');
    const refreshToken = getJwtRedisKey(id, 'refresh');

    // 从 Redis 中删除访问令牌和刷新令牌
    await this.redisService.del(accessToken);
    await this.redisService.del(refreshToken);
  }

  /**
   * 刷新 JWT 令牌
   * @param token - 传入的 refresh JWT 令牌
   * @returns - 返回新生成的 JWT 令牌
   * @throws {UnauthorizedException} - 如果令牌无效或已过期，则抛出未授权异常
   */
  async refresh(token: string) {
    // 定义未授权异常
    const error = new UnauthorizedException(
      '认证已失效，请重新登录',
      ResponseCode.UNAUTHORIZED,
    );

    // 如果传入的令牌为空，则抛出未授权异常
    if (!token) throw error;

    // 验证令牌的有效性
    let payload: App.JwtPayload;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw error;
    }

    // 如果 Redis 中没有刷新令牌或者刷新令牌与传入的令牌不匹配，则抛出未授权异常
    const refreshToken = await this.redisService.get<string>(
      getJwtRedisKey(payload.id, 'refresh'),
    );
    if (!refreshToken && refreshToken !== token) {
      throw error;
    }

    // 生成并返回新的 JWT 令牌
    return await this.registerToken({
      id: payload.id,
      username: payload.username,
      roleIds: payload.roleIds,
    });
  }

  /**
   * 获取当前登录用户信息
   * @param id - 用户 ID
   * @returns - 返回用户信息及授权菜单信息
   */
  async info(id: string) {
    // 根据用户 ID 查询用户信息
    const user = await this.userRepo.findOne({ where: { id } });

    // 查询用户的角色角色信息，并关联查询授权菜单信息
    const roles = await this.roleRepo.find({
      where: { users: { id: user.id }, state: RoleStateEnum.active },
      relations: {
        menus: true,
      },
    });

    // 聚合不同角色下的菜单信息
    const menus = new Set(
      roles.flatMap((role) => role.menus.map((menu) => menu.key)),
    );
    return {
      ...user,
      menus: Array.from(menus),
    };
  }

  /**
   * 注册 JWT 令牌
   * @param payload - 包含用户信息的 JWT 负载
   * @returns - 返回生成的 JWT 令牌
   */
  async registerToken(payload: App.JwtPayload) {
    // 从配置文件中获取访问令牌和刷新令牌的过期时间
    const { accessExpire, refreshExpire } = this.configService.get('jwt');

    // 生成访问令牌和刷新令牌
    const accessToken = createJwt(this.jwtService, payload, accessExpire);
    const refreshToken = createJwt(this.jwtService, payload, refreshExpire);

    // 将访问令牌和刷新令牌存入 Redis，并设置过期时间
    this.redisService.setWithExpire(
      getJwtRedisKey(payload.id, 'access'),
      accessToken,
      accessExpire,
    );
    this.redisService.setWithExpire(
      getJwtRedisKey(payload.id, 'refresh'),
      refreshToken,
      refreshExpire,
    );

    // 返回生成的 JWT 令牌
    return { accessToken, refreshToken };
  }
}

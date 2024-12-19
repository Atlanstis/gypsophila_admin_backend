import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ResponseCode, UnauthorizedException } from 'src/core';
import { RedisService } from 'src/modules';
import { getJwtRedisKey } from 'src/utils';

/**
 * jwt 守卫：
 * 验证 jwt 是否符合格式
 */
@Injectable()
export class JwtGuard implements CanActivate {
  @Inject(RedisService)
  private redisService: RedisService;
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('请进行登录', ResponseCode.UNAUTHORIZED);
    }

    const token = bearer[1];
    let user: App.JwtPayload;
    try {
      user = await this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException(
        '授权已过期，请重新登录',
        ResponseCode.UNAUTHORIZED,
      );
    }
    const cachetoken = await this.redisService.get<string>(
      getJwtRedisKey(user.id, 'access'),
    );
    if (!cachetoken) {
      throw new UnauthorizedException(
        '授权已过期，请重新登录',
        ResponseCode.RE_UNAUTHORIZED,
      );
    }
    if (cachetoken !== token) {
      throw new UnauthorizedException(
        '已在其它地方登录，请重新登录',
        ResponseCode.UNAUTHORIZED,
      );
    }
    request.user = user;
    return true;
  }
}

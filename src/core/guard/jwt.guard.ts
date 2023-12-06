import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';
import { UnauthorizedException } from 'src/core';
import { ResponseCode } from 'src/typings';

/**
 * jwt 守卫：
 * 验证 jwt 是否符合格式
 */
@Injectable()
export class JwtGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException({
        code: ResponseCode.Unauthorized,
        message: '请进行登录',
      });
    }

    const token = bearer[1];
    let user: App.JwtPayload;
    try {
      user = await this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException({
        code: ResponseCode.Unauthorized,
        message: 'token 错误，请重新登录',
      });
    }
    const cachetoken = await this.redisService.get<string>(`access_token-${user.id}`);
    if (!cachetoken) {
      throw new UnauthorizedException({
        code: ResponseCode.ReUnauthorized,
        message: '认证已失效，请重新登录',
      });
    }
    if (cachetoken !== token) {
      throw new UnauthorizedException({
        code: ResponseCode.Unauthorized,
        message: '已在其它地方登录，请重新登录',
      });
    }
    request.user = user;
    return true;
  }
}

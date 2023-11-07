import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VARS } from 'src/enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ENV_VARS.JWT_SECRET),
    });
  }

  /**
   * 通过 @UseGuards(AuthGuard('jwt'))后，@Req req 对象上绑定的 user 对象
   * @param payload jwt解密后数据
   * @returns @Req 用户信息
   */
  async validate(payload: App.JwtPayload) {
    return { id: payload.id, username: payload.username };
  }
}

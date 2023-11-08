import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessException } from 'src/core';
import { UserService } from 'src/user/user.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new BusinessException('用户名不存在');
    }
    const isValid = await argon.verify(user.password, password);
    if (isValid) {
      const payload: App.JwtPayload = { username, id: user.id };
      return { token: await this.jwtService.signAsync(payload) };
    }
    throw new BusinessException('用户名或密码错误');
  }

  register(username: string, password: string) {
    console.log('🚀 ~ file: auth.service.ts:14 ~ AuthService ~ register ~ password:', password);
    console.log('🚀 ~ file: auth.service.ts:15 ~ AuthService ~ username:', username);
  }
}

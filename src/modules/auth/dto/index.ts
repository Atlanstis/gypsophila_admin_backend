import { IsNotEmpty, Validate } from 'class-validator';
import { IsEncryptedData } from 'src/core';

/**
 * 登录 DTO
 * 用于接收登录请求
 */
export class LoginDto {
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @Validate(IsEncryptedData, {
    message: `密码格式错误`,
  })
  password: Common.EncryptData;
}

/**
 * 刷新令牌 DTO
 * 用于接收刷新令牌的请求
 */
export class RefreshDto {
  /** refreshToken */
  @IsNotEmpty({ message: '请传入 refreshToken' })
  refreshToken: string;
}

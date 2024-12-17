import { IsNotEmpty, Validate } from 'class-validator';
import { IsEncryptedData } from 'src/core';

export class LoginDto {
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @Validate(IsEncryptedData, {
    message: `密码加密错误`,
  })
  password: Common.EncryptData;
}

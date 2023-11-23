import { IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(0, 16, { message: '用户名长度为 0 - 16 位' })
  /** 用户名 */
  username: string;

  /** 昵称 */
  @IsNotEmpty({ message: '昵称不能为空' })
  @Length(0, 10, { message: '昵称长度为 0 - 10 位' })
  nickname: string;
}

export class UserAddDto extends UserDto {
  /** 密码 */
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class UserEditDto extends UserDto {
  /** 用户 ID */
  @IsNotEmpty({ message: '用户 ID 不能为空' })
  id: string;
}

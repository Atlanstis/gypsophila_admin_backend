import { IsNotEmpty, Length, IsInt } from 'class-validator';
import { USER_LENGTH } from 'src/constants';

export class UserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(0, USER_LENGTH.USERNAME_MAX, {
    message: `用户名长度为 0 - ${USER_LENGTH.USERNAME_MAX} 位`,
  })
  /** 用户名 */
  username: string;

  /** 昵称 */
  @IsNotEmpty({ message: '昵称不能为空' })
  @Length(0, USER_LENGTH.NICKMAX_MAX, {
    message: `昵称长度为 0 - ${USER_LENGTH.NICKMAX_MAX} 位`,
  })
  nickname: string;

  @IsNotEmpty({ message: '角色不能为空' })
  @IsInt({ message: '角色 Id 类型错误' })
  role: number;
}

export class UserAddDto extends UserDto {
  /** 密码 */
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class UserEditDto extends UserDto {
  /** 用户 ID */
  @IsNotEmpty({ message: '用户 Id 不能为空' })
  id: string;
}

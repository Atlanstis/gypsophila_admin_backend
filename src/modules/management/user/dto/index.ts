import {
  IsNotEmpty,
  Length,
  Validate,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { IsEncryptedData } from 'src/core';
import { UserKeyLength } from '../constants';
import { PickType } from '@nestjs/mapped-types';

export class UserDto {
  /** 用户 ID */
  @IsNotEmpty({ message: '用户 Id 不能为空' })
  id: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(UserKeyLength.usernameMin, UserKeyLength.usernameMax, {
    message: `用户名长度应为 ${UserKeyLength.usernameMin} - ${UserKeyLength.usernameMax} 个字符`,
  })
  /** 用户名 */
  username: string;

  /** 昵称 */
  @IsNotEmpty({ message: '昵称不能为空' })
  @Length(UserKeyLength.nickNameMin, UserKeyLength.nickNameMax, {
    message: `昵称长度应为 ${UserKeyLength.nickNameMin} - ${UserKeyLength.nickNameMax} 个字符`,
  })
  nickname: string;

  @IsNotEmpty({ message: '角色不能为空' })
  @IsArray({ message: '角色格式错误' })
  @ArrayMinSize(UserKeyLength.roleMin, {
    message: `用户最多绑定 ${UserKeyLength.roleMin} - ${UserKeyLength.roleMax} 个角色`,
  })
  @ArrayMaxSize(UserKeyLength.roleMax, {
    message: `用户最多绑定 ${UserKeyLength.roleMin} - ${UserKeyLength.roleMax} 个角色`,
  })
  roleIds: number[];

  @Validate(IsEncryptedData, {
    message: `密码加密错误`,
  })
  password: Common.EncryptData;
}

export class UserAddDto extends PickType(UserDto, [
  'username',
  'nickname',
  'password',
  'roleIds',
]) {}

export class UserEditDto extends PickType(UserDto, [
  'id',
  'nickname',
  'roleIds',
]) {}

export class UserIdDto extends PickType(UserDto, ['id']) {}

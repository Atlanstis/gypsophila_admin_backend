import { IsInt, IsNotEmpty, Length } from 'class-validator';

export class RoleDto {
  /** 角色名 */
  @IsNotEmpty({ message: '角色名不能为空' })
  @Length(1, 16, { message: '角色名长度为 1 - 16 位' })
  name: string;
}

export class RoleEditDto extends RoleDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  @IsInt({ message: 'id 格式不正确' })
  /** 角色 id */
  id: number;
}

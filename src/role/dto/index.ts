import { IsArray, IsInt, IsNotEmpty, Length } from 'class-validator';
import { ROLE_LENGTH } from 'src/constants';

export class RoleDto {
  /** 角色名 */
  @IsNotEmpty({ message: '角色名不能为空' })
  @Length(1, ROLE_LENGTH.NAME_MAX, { message: `角色名长度为 1 - ${ROLE_LENGTH.NAME_MAX} 位` })
  name: string;
}

export class RoleEditDto extends RoleDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  @IsInt({ message: 'id 格式不正确' })
  /** 角色 id */
  id: number;
}

export class RoleMenuDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  @IsInt({ message: 'id 格式不正确' })
  /** 角色 id */
  id: number;
}

export class RoleMenuEditDto extends RoleMenuDto {
  @IsNotEmpty({ message: '菜单不能为空' })
  @IsArray({ message: '菜单格式不正确' })
  menus: string[];
}

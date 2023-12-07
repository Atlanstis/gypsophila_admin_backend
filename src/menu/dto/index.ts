import { IsEnum, IsInt, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { MENU_LENGTH, PERMISSION_LENGTH, PermissionTypeMenu } from 'src/constants';

export class MenuDto {
  @IsNotEmpty({ message: '菜单名称不能为空' })
  @Length(1, MENU_LENGTH.NAME_MAX, {
    message: `菜单名称长度为 1 - ${MENU_LENGTH.NAME_MAX} 个字符`,
  })
  /** 菜单名称 */
  name: string;
  @IsNotEmpty({ message: '菜单 Key 不能为空' })
  @Length(1, MENU_LENGTH.KEY_MAX, {
    message: `菜单 Key 长度为 1 - ${MENU_LENGTH.KEY_MAX} 个字符`,
  })
  /** 菜单 Key */
  key: string;
  /** 父菜单 id */
  @IsNumber({}, { message: '父菜单 id 必须为数字' })
  parentId: number;
}

export class MenuEditDto extends MenuDto {
  @IsNotEmpty({ message: '菜单 id 不能为空' })
  id: number;
}

export class PermissionDto {
  @IsNotEmpty({ message: '权限 Key 不能为空' })
  @Length(1, PERMISSION_LENGTH.KEY_MAX, {
    message: `权限 Key 长度为 1 - ${PERMISSION_LENGTH.KEY_MAX}`,
  })
  key: string;

  @IsNotEmpty({ message: '权限名称不能为空' })
  @Length(1, PERMISSION_LENGTH.NAME_MAX, {
    message: `权限 Key 长度为 1 - ${PERMISSION_LENGTH.NAME_MAX}`,
  })
  name: string;
  @IsNotEmpty({ message: '菜单 id 不能为空' })
  @IsInt({ message: '菜单 id 格式错误' })
  menuId: number;

  @IsNotEmpty({ message: '权限类型不能为空' })
  @IsEnum(PermissionTypeMenu, { message: '权限类型错误' })
  type: number;
}

export class PermissionEditDto extends PermissionDto {
  @IsNotEmpty({ message: '权限 id 不能为空' })
  id: number;
}

export class MenuIdDto {
  @IsNotEmpty({ message: '菜单 id 不能为空' })
  @IsInt({ message: '菜单 id 格式错误' })
  menuId: number;
}

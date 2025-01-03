import { IsInt, IsNotEmpty, Length } from 'class-validator';
import { MenuPermissionConst } from '../constants';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class PermissionDto {
  @IsInt({ message: '权限 id 格式错误' })
  @IsNotEmpty({ message: '权限 id 不能为空' })
  @Type(() => Number)
  id: number;

  @IsNotEmpty({ message: '菜单 id 不能为空' })
  menuId: number;

  @Length(MenuPermissionConst.keyMin, MenuPermissionConst.keyMax, {
    message: `权限标识长度为 ${MenuPermissionConst.keyMin} - ${MenuPermissionConst.keyMax} 个字符`,
  })
  @IsNotEmpty({ message: '权限标识不能为空' })
  key: string;

  @Length(MenuPermissionConst.nameMin, MenuPermissionConst.nameMax, {
    message: `权限名称长度为 ${MenuPermissionConst.nameMin} - ${MenuPermissionConst.nameMax} 个字符`,
  })
  @IsNotEmpty({ message: '权限名称不能为空' })
  name: string;

  @Length(MenuPermissionConst.aliasMin, MenuPermissionConst.aliasMax, {
    message: `权限别名长度为 ${MenuPermissionConst.aliasMin} - ${MenuPermissionConst.aliasMax} 个字符`,
  })
  @IsNotEmpty({ message: '权限别名不能为空' })
  alias: string;

  @IsInt({ message: '排序字段格式错误' })
  @IsNotEmpty({ message: '排序字段不能为空' })
  order: number;
}

export class PermissionAddDto extends OmitType(PermissionDto, ['id']) {}

export class PermissionEditDto extends PermissionDto {}

export class MenuIdDto extends PickType(PermissionDto, ['menuId']) {}

export class MenuPermissionIdDto extends PickType(PermissionDto, ['id']) {}

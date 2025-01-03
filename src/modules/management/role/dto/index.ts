import { IsInt, IsNotEmpty, Length, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { RoleConst } from '../constants';
import { IsMPsArray } from './validator';

export class RoleDto {
  @IsInt({ message: '角色 id 格式不正确' })
  @IsNotEmpty({ message: '角色 id 不能为空' })
  @Type(() => Number)
  /** 角色 id */
  id: number;

  /** 角色名 */
  @Length(RoleConst.nameMin, RoleConst.nameMax, {
    message: `角色名称长度为 ${RoleConst.nameMin} - ${RoleConst.nameMax} 个字符`,
  })
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  /** 角色描述 */
  @Length(0, RoleConst.descMax, {
    message: `角色描述最大长度不能超过 ${RoleConst.descMax} 个字符`,
  })
  desc: string;
}

export class RoleAddDto extends OmitType(RoleDto, ['id'] as const) {}

export class RoleEditDto extends RoleDto {}

export class RoleIdDto extends PickType(RoleDto, ['id'] as const) {}

export class RMPEditDto extends PickType(RoleDto, ['id'] as const) {
  @Validate(IsMPsArray)
  mps: {
    menuId: number;
    permissionIds: number[];
  }[];
}

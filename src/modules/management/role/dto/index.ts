import { IsInt, IsNotEmpty, Length, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { RoleConst } from '../constants';
import { IsMPsArray } from './validator';

export class RoleDto {
  @IsNotEmpty({ message: '角色 id 不能为空' })
  @IsInt({ message: '角色 id 格式不正确' })
  @Type(() => Number)
  /** 角色 id */
  id: number;

  /** 角色名 */
  @IsNotEmpty({ message: '角色名称不能为空' })
  @Length(RoleConst.nameMin, RoleConst.nameMax, {
    message: `角色名称长度为 ${RoleConst.nameMin} - ${RoleConst.nameMax} 个字符`,
  })
  name: string;

  /** 角色描述 */
  @Length(RoleConst.descMin, RoleConst.descMax, {
    message: `角色描述长度为 ${RoleConst.descMin} - ${RoleConst.descMax} 个字符`,
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

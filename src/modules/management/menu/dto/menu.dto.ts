import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  Allow,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Length,
} from 'class-validator';
import { MenuTypeEnum } from '../entity';
import { MenuConst } from '../constants';
import { Type } from 'class-transformer';

export class MenuDto {
  @IsNumber({}, { message: '菜单 id 格式错误' })
  @IsNotEmpty({ message: '菜单 id 不能为空' })
  @Type(() => Number)
  id: number;

  @Length(MenuConst.nameMin, MenuConst.nameMax, {
    message: `菜单名称长度为 ${MenuConst.nameMin} - ${MenuConst.nameMax} 个字符`,
  })
  @IsNotEmpty({ message: '菜单名称不能为空' })
  /** 菜单名称 */
  name: string;

  @Length(MenuConst.keyMin, MenuConst.keyMax, {
    message: `菜单标识长度为 ${MenuConst.keyMin} - ${MenuConst.keyMax} 个字符`,
  })
  @IsNotEmpty({ message: '菜单标识不能为空' })
  /** 菜单标识 */
  key: string;

  /** 菜单类型 */
  @IsEnum(MenuTypeEnum, { message: '菜单类型错误' })
  @IsNotEmpty({ message: '菜单类型不能为空' })
  type: MenuTypeEnum;

  @IsInt({ message: '排序字段格式错误' })
  @IsNotEmpty({ message: '排序字段不能为空' })
  order: number;
}

export class MenuAddDto extends OmitType(MenuDto, ['id']) {
  /** 父菜单 id */
  @Allow()
  parentId?: number;
}

export class MenuEditDto extends MenuDto {}

export class IdDto extends PickType(MenuDto, ['id']) {}

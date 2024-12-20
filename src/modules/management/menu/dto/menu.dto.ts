import { OmitType, PickType } from '@nestjs/mapped-types';
import { Allow, IsEnum, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { MenuTypeEnum } from '../entity';
import { MenuConst } from '../constants';
import { Type } from 'class-transformer';

export class MenuDto {
  @IsNotEmpty({ message: '菜单 id 不能为空' })
  @IsNumber({}, { message: '菜单 id 格式错误' })
  @Type(() => Number)
  id: number;

  @IsNotEmpty({ message: '菜单名称不能为空' })
  @Length(MenuConst.nameMin, MenuConst.nameMax, {
    message: `菜单名称长度为 ${MenuConst.nameMin} - ${MenuConst.nameMax} 个字符`,
  })
  /** 菜单名称 */
  name: string;

  @IsNotEmpty({ message: '菜单标识不能为空' })
  @Length(MenuConst.keyMin, MenuConst.keyMax, {
    message: `菜单标识长度为 ${MenuConst.keyMin} - ${MenuConst.keyMax} 个字符`,
  })
  /** 菜单标识 */
  key: string;

  /** 菜单类型 */
  @IsNotEmpty({ message: '菜单类型不能为空' })
  @IsEnum(MenuTypeEnum, { message: '菜单类型错误' })
  type: MenuTypeEnum;
}

export class MenuAddDto extends OmitType(MenuDto, ['id']) {
  /** 父菜单 id */
  @Allow()
  parentId?: number;
}

export class MenuEditDto extends MenuDto {}

export class IdDto extends PickType(MenuDto, ['id']) {}

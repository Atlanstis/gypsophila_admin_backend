export * from './channel.dto';
export * from './gold-record.dto';
export * from './gold-transfer.dto';
export * from './account-group.dto';
export * from './account.dto';

import { Allow, IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { MHXY_PROP_CATEGORY_LENGTH } from 'src/constants';
import { MhxyPropCategory } from 'src/entities';

/** 贸易种类新增 */
export class GoldTradeCategoryAddDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_PROP_CATEGORY_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_PROP_CATEGORY_LENGTH.NAME_MAX} 个字符`,
  })
  /** 种类名称 */
  name: string;
  @IsBoolean({ message: 'isTransfer 类型错误' })
  /** 是否是转金项 */
  isTransfer: boolean;
  @IsBoolean({ message: 'isGem 类型错误' })
  /** 是否是珍品 */
  isGem: boolean;
}

/** 贸易种类编辑 */
export class GoldTradeCategoryEditDto extends GoldTradeCategoryAddDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

/** 贸易种类删除 */
export class GoldTradeCategoryDeleteDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

/** 道具种类 */
export class PropCategoryBaseDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_PROP_CATEGORY_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_PROP_CATEGORY_LENGTH.NAME_MAX} 个字符`,
  })
  name: MhxyPropCategory['name'];
  @Allow()
  isGem: boolean;
}

/** 道具种类-新增 */
export class PropCategoryAddDto extends PropCategoryBaseDto {
  @Allow()
  parentId?: MhxyPropCategory['id'];
}

/** 道具种类-编辑 */
export class PropCategoryEditDto extends PropCategoryBaseDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyPropCategory['id'];
}

/** 道具种类-删除 */
export class PropCategoryDeleteDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyPropCategory['id'];
}

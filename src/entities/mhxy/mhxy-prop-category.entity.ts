import { MHXY_PROP_CATEGORY_LENGTH, MHXY_PROP_CATEGORY_TOP_FLAG } from '../../constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** 梦幻道具种类表 */
@Entity({ name: 'mhxy_prop_category' })
export class MhxyPropCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '名称', length: MHXY_PROP_CATEGORY_LENGTH.NAME_MAX })
  name: string;

  @Column({ comment: '是否为珍品', default: false })
  isGem: boolean;

  @Column({ comment: '父级 id', default: MHXY_PROP_CATEGORY_TOP_FLAG })
  parentId: number;

  /** 用于列表搜索 */
  children?: MhxyPropCategory[];
}

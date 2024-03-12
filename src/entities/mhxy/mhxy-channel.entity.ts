import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MHXY_CHANNEL_LENGTH } from '../../constants';

/** 梦幻途径表 */
@Entity({ name: 'mhxy_channel' })
export class MhxyChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '途径 key，唯一，用于业务判断',
    length: MHXY_CHANNEL_LENGTH.NAME_MAX,
    nullable: true,
  })
  key: string;

  @Column({ comment: '名称', length: MHXY_CHANNEL_LENGTH.KEY_MAX })
  name: string;

  @Column({ comment: '是否默认', name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ comment: '父级 id', name: 'parent_id', default: 0 })
  parentId: number;

  /** 用于列表搜索 */
  children?: MhxyChannel[];
}

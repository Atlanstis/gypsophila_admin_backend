import { NoticeCategoryEnum, NoticeLength, NoticeStatusEnum, NoticeTypeEnum } from '../constants';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'notice' })
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '标题', length: NoticeLength.TitleMax })
  title: string;

  @Column({ comment: '描述', length: NoticeLength.DescriptionMax, nullable: true })
  description: string;

  @Column({ comment: '类型', type: 'enum', enum: NoticeTypeEnum })
  type: NoticeTypeEnum;

  @Column({ comment: '种类', type: 'varchar', length: NoticeLength.CategoryMax, nullable: true })
  category: NoticeCategoryEnum;

  @Column({ comment: '关联信息', type: 'json', nullable: true })
  link: Record<string, any>;

  @Column({
    comment: '状态',
    type: 'enum',
    enum: NoticeStatusEnum,
    default: NoticeStatusEnum.Active,
  })
  status: NoticeStatusEnum;

  @Column({
    name: 'expire_time',
    type: 'datetime',
    comment: '过期时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expireTime: Date;

  @Column({
    name: 'create_time',
    type: 'datetime',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  /** 归属系统用户 */
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

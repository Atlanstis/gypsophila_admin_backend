import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MHXY_ACCOUNT_GOLD_RECORD_LENGTH } from '../../constants';
import { User } from '../user.entity';
import { MhxyAccount } from './mhxy-account.entity';
import { MhxyChannel } from './mhxy-channel.entity';
import { MhxyPropCategory } from './mhxy-prop-category.entity';
import { MhxyAccountGoldTransfer } from './mhxy-account-gold-transfer.entity';

/** 梦幻账号金币收支记录表 */
@Entity({ name: 'mhxy_account_gold_record', orderBy: { createTime: 'DESC' } })
export class MhxyAccountGoldRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MhxyChannel, { nullable: false })
  @JoinColumn({ name: 'channel_id' })
  channel: MhxyChannel;

  @ManyToOne(() => MhxyPropCategory)
  @JoinColumn({ name: 'prop_category_id' })
  propCategory: MhxyPropCategory;

  @Column({ comment: '数额', default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['expenditure', 'revenue'],
    comment: '收支类型: expenditure-支出,revenue-收入',
    default: 'revenue',
  })
  type: 'expenditure' | 'revenue';

  /** 归属梦幻账户 */
  @ManyToOne(() => MhxyAccount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'account_id' })
  account: MhxyAccount;

  /** 归属系统用户 */
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ comment: '状态: 0-进行中,1-已完成', default: 1 })
  status: 0 | 1;

  @Column({ comment: '备注', default: '', length: MHXY_ACCOUNT_GOLD_RECORD_LENGTH.REMARK_MAX })
  remark: string;

  /** 创建时间 */
  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;
  @ManyToOne(() => MhxyAccountGoldTransfer, (transfer) => transfer.records, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'transfer_id' })
  transfer: MhxyAccountGoldTransfer;
}

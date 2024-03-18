import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyAccount } from './mhxy-account.entity';
import { User } from '../user.entity';
import { MhxyPropCategory } from './mhxy-prop-category.entity';
import { MHXY_GOLD_TRANSFER_STATUS } from '../../mhxy/constants';
import { MhxyAccountGoldRecord } from './mhxy-account-gold-record.entity';

@Entity({ name: 'mhxy_account_gold_transfer', orderBy: { createTime: 'DESC' } })
export class MhxyAccountGoldTransfer {
  @PrimaryGeneratedColumn()
  id: number;

  /** 转出账号 */
  @ManyToOne(() => MhxyAccount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'from_account_id' })
  fromAccount: MhxyAccount;

  /** 接收账号 */
  @ManyToOne(() => MhxyAccount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'to_account_id' })
  toAccount: MhxyAccount;

  @ManyToOne(() => MhxyPropCategory, { nullable: false })
  @JoinColumn({ name: 'prop_category_id' })
  propCategory: MhxyPropCategory;

  /** 归属系统用户 */
  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ comment: '支出金额', name: 'expenditure_amount', default: 0 })
  expenditureAmount: number;

  @Column({ comment: '收入金额', name: 'revenue_amount', default: 0 })
  revenueAmount: number;

  @Column({
    comment: '状态',
    type: 'enum',
    enum: MHXY_GOLD_TRANSFER_STATUS,
    default: MHXY_GOLD_TRANSFER_STATUS.PROGRESS,
  })
  status: MHXY_GOLD_TRANSFER_STATUS;

  @Column({
    comment: '转金时间',
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @OneToMany(() => MhxyAccountGoldRecord, (record) => record.transfer)
  records: MhxyAccountGoldRecord[];
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyAccount } from './mhxy-account.entity';
import { MhxyGoldTradeCategory } from './mhxy-gold-trade-category.entity';
import { User } from '../user.entity';
import { MhxyAccountGoldRecord } from './mhxy-account-gold-record.entity';
import { AccountGoldTransferStatus } from '../../constants';

@Entity({ name: 'mhxy_account_gold_transfer', orderBy: { createTime: 'DESC' } })
export class MhxyAccountGoldTransfer {
  @PrimaryGeneratedColumn()
  id: number;

  /** 转出账号 */
  @ManyToOne(() => MhxyAccount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'from_account_id' })
  fromAccount: MhxyAccount;

  /** 接收账号 */
  @ManyToOne(() => MhxyAccount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'to_account_id' })
  toAccount: MhxyAccount;

  /** 归属系统用户 */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ comment: '转出账号转金前金币数量', name: 'from_before_gold', default: 0 })
  fromBeforeGold: number;

  @Column({ comment: '转出账号转金前后金币数量', name: 'from_after_gold', default: 0 })
  fromAfterGold: number;

  @Column({ comment: '转入账号转金前金币数量', name: 'to_before_gold', default: 0 })
  toBeforeGold: number;

  @Column({ comment: '转入账号转金后金币数量', name: 'to_after_gold', default: 0 })
  toAfterGold: number;

  /** 贸易种类 */
  @ManyToOne(() => MhxyGoldTradeCategory)
  @JoinColumn({ name: 'gold_trade_category_id' })
  category: MhxyGoldTradeCategory;

  @Column({ comment: '是否是珍品转金', name: 'is_gem', default: false })
  isGem: boolean;

  @Column({ comment: '珍品交易金额', name: 'gold_amount', default: 0 })
  goldAmount: number;

  @Column({
    comment: '珍品交易审核结束时间',
    name: 'audit_end_time',
    type: 'timestamp',
    nullable: true,
  })
  auditEndTime: Date;

  @Column({
    comment: '状态',
    type: 'enum',
    enum: AccountGoldTransferStatus,
    default: AccountGoldTransferStatus.progress,
  })
  status: AccountGoldTransferStatus;

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

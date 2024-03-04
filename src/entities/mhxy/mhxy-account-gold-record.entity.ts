import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyGoldTradeCategory } from './mhxy-gold-trade-category.entity';
import { MHXY_ACCOUNT_GOLD_RECORD_LENGTH } from '../../constants';
import { User } from '../user.entity';
import { MhxyAccount } from './mhxy-account.entity';

/** 梦幻账号金币收支记录表 */
@Entity({ name: 'mhxy_account_gold_record', orderBy: { createTime: 'DESC' } })
export class MhxyAccountGoldRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '数额', default: 0 })
  num: number;

  @Column({ comment: '操作前金币数量', default: 0 })
  beforeNum: number;

  @Column({ comment: '操作后金币数量', default: 0 })
  afterNum: number;

  @Column({
    type: 'enum',
    enum: ['expenditure', 'revenue'],
    comment: '收支类型: expenditure-支出,revenue-收入',
    default: 'revenue',
  })
  type: 'expenditure' | 'revenue';

  /** 交易种类 */
  @ManyToOne(() => MhxyGoldTradeCategory)
  @JoinColumn({ name: 'gold_trade_category_id' })
  category: MhxyGoldTradeCategory;

  /** 归属梦幻账户 */
  @ManyToOne(() => MhxyAccount)
  @JoinColumn({ name: 'account_id' })
  account: MhxyAccount;

  /** 归属系统用户 */
  @ManyToOne(() => User, (user) => user.mhxyAccounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ comment: '备注', default: '', length: MHXY_ACCOUNT_GOLD_RECORD_LENGTH.REMARK_MAX })
  remark: string;

  /** 创建时间 */
  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;
}

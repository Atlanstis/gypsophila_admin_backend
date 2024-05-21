import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyAccount } from './mhxy-account.entity';

@Entity({ name: 'mhxy_account_gold_daily' })
export class MhxyAccountGoldDaily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MhxyAccount, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'account_id' })
  account: MhxyAccount;

  @Column({ comment: '统计日期', type: 'date' })
  date: Date;

  @Column({ comment: '金额', type: 'int', default: 0 })
  amount: number;

  @Column({ comment: '与前一日金额差额', name: 'change_amount', type: 'int', default: 0 })
  changeAmount: number;
}

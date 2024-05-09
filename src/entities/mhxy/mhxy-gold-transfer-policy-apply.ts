import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyGoldTransferPolicy } from './mhxy-gold-transfer-policy';
import { MhxyAccount } from './mhxy-account.entity';
import { ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS } from '../../constants';
import { User } from '../user.entity';

@Entity({ name: 'mhxy_gold_transfer_policy_apply' })
/** MHXY 转金策略应用表 */
export class MhxyGoldTransferPolicyApply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MhxyAccount)
  @JoinColumn({ name: 'account_id' })
  account: MhxyAccount;

  @ManyToOne(() => MhxyGoldTransferPolicy, (policy) => policy.applies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'policy_id' })
  policy: MhxyGoldTransferPolicy;

  @Column({
    comment: '状态',
    type: 'enum',
    enum: ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS,
    default: ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.OPEN,
  })
  status: ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS;

  @Column({ comment: '下次执行时间', name: 'next_execute_time', type: 'date', nullable: true })
  nextExecuteTime: Date;

  @Column({ comment: '上次执行时间', name: 'last_execute_time', type: 'date', nullable: true })
  lastExecuteTime: Date;

  /** 归属系统用户 */
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

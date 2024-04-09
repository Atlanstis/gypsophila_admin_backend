import { MHXY_GOLD_TRANSFER_POLICY_LENGTH } from '../../constants';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyPropCategory } from './mhxy-prop-category.entity';
import { MhxyGoldTransferPolicyApply } from './mhxy-gold-transfer-policy-apply';
import { User } from '../user.entity';

@Entity({ name: 'mhxy_gold_transfer_policy' })
/** MHXY 转金策略表 */
export class MhxyGoldTransferPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '策略名称', length: MHXY_GOLD_TRANSFER_POLICY_LENGTH.NAME_MAX })
  name: string;

  @ManyToOne(() => MhxyPropCategory, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'prop_category_id' })
  propCategory: MhxyPropCategory;

  @Column({ comment: '额度', type: 'int' })
  quota: number;

  @Column({ comment: '周期(天)', name: 'cycle_by_day', type: 'int' })
  cycleByDay: number;

  @OneToMany(() => MhxyGoldTransferPolicyApply, (apply) => apply.policy)
  applies: MhxyGoldTransferPolicyApply[];

  /** 归属系统用户 */
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

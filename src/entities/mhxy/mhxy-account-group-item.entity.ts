import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyAccountGroup } from './mhxy-account-group.entity';
import { MhxyAccount } from './mhxy-account.entity';

@Entity({ name: 'mhxy_account_group_item', orderBy: { id: 'ASC' } })
export class MhxyAccountGroupItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '备注', type: 'text', nullable: true })
  remark: string;

  @OneToOne(() => MhxyAccount, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'account_id' })
  account: MhxyAccount;

  @ManyToOne(() => MhxyAccountGroup, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'account_group_id' })
  group: MhxyAccountGroup;
}

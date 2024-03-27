import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyAccountGroupItem } from './mhxy-account-group-item.entity';
import { MHXY_ACCOUNT_GROUP_LENGTH } from '../../constants';
import { User } from '../user.entity';
import { MhxyAccount } from './mhxy-account.entity';

@Entity({ name: 'mhxy_account_group' })
export class MhxyAccountGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '名称', length: MHXY_ACCOUNT_GROUP_LENGTH.NAME_MAX })
  name: string;

  @OneToMany(() => MhxyAccountGroupItem, (item) => item.group)
  items: MhxyAccountGroupItem[];

  /** 归属系统用户 */
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** 关联账号，查询用 */
  accounts: MhxyAccount[];
}

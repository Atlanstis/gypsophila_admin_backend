import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TimeNotSelectBase } from '../base';
import { MHXY_ACCOUNT_LENGTH } from '../../constants';
import { User } from '../../entities';

/** 梦幻账号表 */
@Entity({ name: 'mhxy_account' })
export class MhxyAccount extends TimeNotSelectBase {
  @PrimaryColumn({ length: MHXY_ACCOUNT_LENGTH.ID_MAX, comment: '账号 Id （官方）' })
  id: string;

  @Column({ length: MHXY_ACCOUNT_LENGTH.NAME_MAX, comment: '账号名称' })
  name: string;

  @Column({ name: 'is_primary', comment: '是否是主号', default: false })
  isPrimary: boolean;

  @Column({ name: 'role', comment: '角色' })
  role: string;

  @Column({ name: 'sect', comment: '门派' })
  sect: string;

  @Column({ name: 'gold', comment: '金币数量', default: 0 })
  gold: number;

  @ManyToOne(() => User, (user) => user.mhxyAccounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

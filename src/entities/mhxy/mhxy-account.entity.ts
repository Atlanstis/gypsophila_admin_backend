import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { TimeNotSelectBase } from '../base';
import { MHXY_ACCOUNT_LENGTH } from '../../constants';
import { User, MhxyAccountGoldRecord } from '../../entities';

/** 梦幻账号表 */
@Entity({ name: 'mhxy_account', orderBy: { isPrimary: 'DESC' } })
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

  /** 归属系统用户 */
  @ManyToOne(() => User, (user) => user.mhxyAccounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** 金币收支记录 */
  @OneToMany(() => MhxyAccountGoldRecord, (goldTrend) => goldTrend.account)
  goldRecords: MhxyAccountGoldRecord[];
}

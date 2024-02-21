import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TimeNotSelectBase } from '../base';
import { MHXY_ACCOUNT_LENGTH } from '../../constants';
import { MhxyAccountRole } from './mhxy-accoout-role.entity';
import { MhxyAccountSect } from './mhxy-account-sect.entity';

/** 梦幻账号表 */
@Entity({ name: 'mhxy_account' })
export class MhxyAccount extends TimeNotSelectBase {
  @PrimaryColumn({ length: MHXY_ACCOUNT_LENGTH.ID_MAX, comment: '账号 Id （官方）' })
  id: string;

  @Column({ length: MHXY_ACCOUNT_LENGTH.NAME_MAX, comment: '账号名称' })
  name: string;

  @Column({ name: 'is_primary', comment: '是否是主号', default: false })
  isPrimary: boolean;

  @ManyToOne(() => MhxyAccountRole, (role) => role.accounts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: MhxyAccountRole;

  @ManyToOne(() => MhxyAccountSect, (sect) => sect.accounts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sect_id' })
  sect: MhxyAccountSect;
}

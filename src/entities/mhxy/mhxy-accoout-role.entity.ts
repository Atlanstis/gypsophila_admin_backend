import { MHXY_ACCOUNT_ROLE_LENGTH } from '../../constants';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyAccount } from './mhxy-account.entity';

/** 梦幻角色表 */
@Entity({ name: 'mhxy_account_role', orderBy: { id: 'ASC' } })
export class MhxyAccountRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '角色名', length: MHXY_ACCOUNT_ROLE_LENGTH.NAME_MAX, unique: true })
  name: string;

  @Column({ comment: '头像地址', length: MHXY_ACCOUNT_ROLE_LENGTH.AVATAR_MAX })
  avatar: string;

  @OneToMany(() => MhxyAccount, (account) => account.role)
  accounts: MhxyAccount[];
}

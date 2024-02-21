import { MHXY_ACCOUNT_SECT_LENGTH } from '../../constants';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyAccount } from './mhxy-account.entity';

/** 梦幻门派表 */
@Entity({ name: 'mhxy_account_sect', orderBy: { id: 'ASC' } })
export class MhxyAccountSect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '门派名', length: MHXY_ACCOUNT_SECT_LENGTH.NAME_MAX, unique: true })
  name: string;

  @Column({ comment: '缩略图地址', length: MHXY_ACCOUNT_SECT_LENGTH.THUMBNAIL_MAX })
  thumbnail: string;

  @OneToMany(() => MhxyAccount, (account) => account.sect)
  accounts: MhxyAccount[];
}

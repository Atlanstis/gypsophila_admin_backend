import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeNotSelectBase } from '../base';
import { User } from '../user.entity';
import { PSN_PROFILE_LENGTH } from '../../constants';
import { PsnProfileGame } from './psn-profile-game.entity';

@Entity({
  name: 'psn_profile',
})
export class PsnProfile extends TimeNotSelectBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'psn_id', comment: 'Psn Id', width: PSN_PROFILE_LENGTH.PSN_ID_MAX, unique: true })
  psnId: string;

  @Column({ comment: '头像地址', width: PSN_PROFILE_LENGTH.AVATAR_MAX })
  avatar: string;

  @Column({ comment: '白金奖杯数量', default: 0 })
  platinum: number;

  @Column({ comment: '金奖杯数量', default: 0 })
  gold: number;

  @Column({ comment: '银奖杯数量', default: 0 })
  silver: number;

  @Column({ comment: '铜奖杯数量', default: 0 })
  bronze: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => PsnProfileGame, (profileGames) => profileGames.profile)
  profileGames: PsnProfileGame[];
}

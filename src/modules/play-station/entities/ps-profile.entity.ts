import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Const_PsProfile } from '../constants';
import { User, PsProfileGame, PsProfileTrophy } from 'src/entities';

@Entity({
  name: 'ps_profile',
  comment: 'PS 账号信息',
})
export class PsProfile {
  @PrimaryColumn({
    name: 'psn_id',
    comment: 'PSN ID',
    length: Const_PsProfile.psnIdMax,
  })
  psnId: string;

  @Column({
    name: 'avatar',
    comment: '头像地址',
    length: Const_PsProfile.avatarMax,
  })
  avatar: string;

  @Column({ name: 'platinum', comment: '白金奖杯数量', default: 0 })
  platinum: number;

  @Column({ name: 'gold', comment: '金奖杯数量', default: 0 })
  gold: number;

  @Column({ name: 'silver', comment: '银奖杯数量', default: 0 })
  silver: number;

  @Column({ name: 'bronze', comment: '铜奖杯数量', default: 0 })
  bronze: number;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'user_id', select: false })
  userId: User['id'];

  @OneToMany(() => PsProfileGame, (profileGame) => profileGame.profile)
  games?: PsProfileGame[];

  @OneToMany(() => PsProfileTrophy, (profiletrophy) => profiletrophy.profile)
  trophies?: PsProfileTrophy[];

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @BeforeUpdate()
  updateDates() {
    this.updateTime = new Date();
  }
}

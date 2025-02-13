import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PsProfile, PsProfileGame, PsTrophy } from 'src/entities';

@Entity({
  name: 'ps_profile_trophy',
})
export class PsProfileTrophy implements PlayStation.ProfileTrophy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '获取时间',
    name: 'complete_time',
    type: 'timestamp',
    nullable: true,
  })
  completeTime: string;

  @Column({
    comment: '跳杯截图',
    length: 255,
    nullable: true,
  })
  screenshot: string;

  @Column({
    comment: '跳杯视频',
    length: 255,
    nullable: true,
  })
  video: string;

  @ManyToOne(() => PsProfileGame, (profileGame) => profileGame.trophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_game_id' })
  profileGame?: PsProfileGame;

  @Column({ name: 'profile_game_id' })
  profileGameId: PsProfileGame['id'];

  @ManyToOne(() => PsTrophy, (trophy) => trophy.profileTrophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'trophy_id' })
  trophy?: PsTrophy;

  @Column({ name: 'trophy_id' })
  trophyId: PsTrophy['id'];

  @ManyToOne(() => PsProfile, (profile) => profile.trophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile?: PsProfile;

  @Column({ name: 'profile_id' })
  profileId: PsProfile['psnId'];
}

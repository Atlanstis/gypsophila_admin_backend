import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PsProfile } from './ps-profile.entity';
import { PsGame, PsProfileTrophy } from 'src/entities';

@Entity({ name: 'ps_profile_game' })
export class PsProfileGame implements PlayStation.ProfileGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'platinum', comment: '获得白金奖杯数量', default: 0 })
  platinum: number;

  @Column({ name: 'gold', comment: '获得金奖杯数量', default: 0 })
  gold: number;

  @Column({ name: 'silver', comment: '获得银奖杯数量', default: 0 })
  silver: number;

  @Column({ name: 'bronze', comment: '获得铜奖杯数量', default: 0 })
  bronze: number;

  @ManyToOne(() => PsProfile, (profile) => profile.games, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile?: PsProfile;

  @Column({ name: 'profile_id' })
  profileId: PsProfile['psnId'];

  @ManyToOne(() => PsGame, (game) => game.profileGames, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game?: PsGame;

  @Column({ name: 'game_id' })
  gameId: PsGame['id'];

  @OneToMany(
    () => PsProfileTrophy,
    (profileGameTrophies) => profileGameTrophies.profileGame,
  )
  trophies?: PsProfileTrophy[];

  @Column({
    comment: '同步时间',
    name: 'sync_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  syncTime: Date;
}

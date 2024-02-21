import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeNotSelectBase } from '../base';
import { PsnProfile } from './psn-profile.entity';
import { PsnGame } from './psn-game.entity';
import { PsnProfileGameTrophy } from './psn-profile-game-trophy.entity';
import { PsnProfileGameGuide } from './psn-profile-game-guide.entity';

@Entity({ name: 'psn_profile_game' })
export class PsnProfileGame extends TimeNotSelectBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_favor', comment: '是否收藏', default: false })
  isFavor: boolean;

  @Column({
    name: 'favor_time',
    comment: '收藏时间',
    type: 'timestamp',
    default: null,
  })
  favorTime: Date;

  @Column({
    name: 'sync_time',
    comment: '同步时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  syncTime: Date;

  @Column({ name: 'platinum_got', comment: '获得白金奖杯数量', default: 0 })
  platinumGot: number;

  @Column({ name: 'gold_got', comment: '获得金奖杯数量', default: 0 })
  goldGot: number;

  @Column({ name: 'silver_got', comment: '获得银奖杯数量', default: 0 })
  silverGot: number;

  @Column({ name: 'bronze_got', comment: '获得铜奖杯数量', default: 0 })
  bronzeGot: number;

  @ManyToOne(() => PsnProfile, (profile) => profile.profileGames, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'psn_profile_id' })
  profile: PsnProfile;

  @ManyToOne(() => PsnGame, (game) => game.profileGames, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'psn_game_id' })
  game: PsnGame;

  @OneToMany(() => PsnProfileGameTrophy, (profileGameTrophies) => profileGameTrophies.profileGame)
  profileGameTrophies: PsnProfileGameTrophy[];

  @OneToMany(() => PsnProfileGameGuide, (guide) => guide.profileGame)
  guides: PsnProfileGameGuide[];
}

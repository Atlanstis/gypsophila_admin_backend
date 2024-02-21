import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PsnTrophy } from './psn-trophy.entity';
import { PsnProfileGame } from './psn-profile-game.entity';

@Entity({
  name: 'psn_profile_game_trophy',
})
export class PsnProfileGameTrophy {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    comment: '获取时间',
    name: 'complete_time',
    type: 'timestamp',
    nullable: true,
  })
  completeTime: Date;

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

  @ManyToOne(() => PsnProfileGame, (profileGame) => profileGame.profileGameTrophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'psn_profile_game_id' })
  profileGame: PsnProfileGame;

  @ManyToOne(() => PsnTrophy, (trophy) => trophy.profileGameTrophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'psn_trophy_id' })
  trophy: PsnTrophy;
}

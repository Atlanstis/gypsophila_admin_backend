import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PsTrophy, PsGame } from 'src/entities';

@Entity({ name: 'ps_trophy_group', comment: 'PS 奖杯组' })
export class PsTrophyGroup implements PlayStation.TrophyGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '名称', length: 128 })
  name: string;

  @Column({
    length: 255,
    comment: '缩略图',
  })
  thumbnail: string;

  @Column({
    comment: '白金奖杯数',
  })
  platinum: number;

  @Column({
    comment: '金奖杯数',
  })
  gold: number;

  @Column({
    comment: '银奖杯数',
  })
  silver: number;

  @Column({
    comment: '铜奖杯数',
  })
  bronze: number;

  @ManyToOne(() => PsGame, (game) => game.trophyGroups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game?: PsGame;

  @Column({ name: 'game_id' })
  gameId: PsGame['id'];

  @OneToMany(() => PsTrophy, (trophy) => trophy.group)
  trophies?: PsTrophy[];

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

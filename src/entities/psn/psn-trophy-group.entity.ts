import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeNotSelectBase } from '../base';
import { PsnGame } from './psn-game.entity';
import { PsnTrophy } from './psn-trophy.entity';

@Entity({ name: 'psn_trophy_group' })
export class PsnTrophyGroup extends TimeNotSelectBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '名称', width: 128 })
  name: string;

  @Column({
    length: 255,
    comment: '缩略图',
  })
  thumbnail: string;

  @Column({ comment: '是否 DLC', name: 'is_dlc' })
  isDLC: boolean;

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

  @ManyToOne(() => PsnGame, (game) => game.trophyGroups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'psn_game_id' })
  game: PsnGame;

  @OneToMany(() => PsnTrophy, (trophy) => trophy.group)
  trophies: PsnTrophy[];
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeBase } from './base';
import { PSN_PROFILE_GAME_GUIDE_LENGTH, PSN_PROFILE_GAME_GUIDE_TYPE_ENUM } from '../constants';
import { PsnProfileGame } from './psn-profile-game.entity';

@Entity({ name: 'psn_profile_game_guide', orderBy: { updateTime: 'DESC' } })
export class PsnProfileGameGuide extends TimeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '标题', length: PSN_PROFILE_GAME_GUIDE_LENGTH.TITLE_MAX })
  title: string;

  @Column({ comment: '类型', type: 'enum', enum: PSN_PROFILE_GAME_GUIDE_TYPE_ENUM, default: 'url' })
  type: PSN_PROFILE_GAME_GUIDE_TYPE_ENUM;

  @Column({ comment: 'url 地址', length: PSN_PROFILE_GAME_GUIDE_LENGTH.URL_MAX, nullable: true })
  url: string;

  @Column({ type: 'text', comment: '文本内容', nullable: true })
  text: string;

  @Column({ comment: '排序', default: 0 })
  order: number;

  @Column({ name: 'is_completed', comment: '是否完成', default: false })
  isCompleted: boolean;

  @ManyToOne(() => PsnProfileGame, (game) => game.guides, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'psn_profile_game_id' })
  profileGame: PsnProfileGame;
}

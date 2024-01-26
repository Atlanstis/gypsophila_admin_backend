import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PsnGame } from './psn-game.entity';

@Entity({
  name: 'psn_game_link',
})
export class PsnGameLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'psnine_id',
    comment: 'psnine 游戏Id',
  })
  psnineId: number;

  @Column({
    name: 'psnine_url',
    length: 128,
    comment: 'psnine 链接地址',
  })
  psnineUrl: string;

  @OneToOne(() => PsnGame, (game) => game.link, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'psn_game_id' })
  game: PsnGame;
}

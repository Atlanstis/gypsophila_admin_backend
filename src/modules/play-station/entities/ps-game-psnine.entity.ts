import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PsGame } from 'src/entities';

@Entity({
  name: 'ps_game_psnine',
})
export class PsGamePsnine implements PlayStation.GamePsnine {
  @PrimaryColumn({
    name: 'id',
    comment: 'psnine ID',
  })
  id: number;

  @Column({
    name: 'url',
    length: 128,
    comment: 'psnine 链接地址',
  })
  url: string;

  @PrimaryColumn({ name: 'game_id' })
  gameId: PsGame['id'];

  @OneToOne(() => PsGame, (game) => game.psnine, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game?: PsGame;
}

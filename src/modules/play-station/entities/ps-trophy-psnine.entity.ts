import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PsTrophy } from 'src/entities';

@Entity({ name: 'ps_trophy_psnine' })
export class PsTrophyPsnine {
  @PrimaryColumn({
    name: 'id',
    comment: 'psnine 关联 ID',
  })
  id: number;

  @Column({
    name: 'url',
    length: 128,
    comment: 'psnine 链接地址',
  })
  url: string;

  @PrimaryColumn({ name: 'trophy_id' })
  trophyId: PsTrophy['id'];

  @OneToOne(() => PsTrophy, (trophy) => trophy.psnine, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'trophy_id' })
  trophy?: PsTrophy;
}

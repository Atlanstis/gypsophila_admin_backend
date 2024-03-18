import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PsnTrophy } from './psn-trophy.entity';

@Entity({ name: 'psn_trophy_link' })
export class PsnTrophyLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'psnine_trophy_id',
    comment: 'psnine 奖杯 Id',
  })
  psnineTrophyId: number;

  @Column({
    name: 'psnine_url',
    length: 128,
    comment: 'psnine 链接地址',
  })
  psnineUrl: string;

  @OneToOne(() => PsnTrophy, (trophy) => trophy.link, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'psn_trophy_id' })
  trophy: PsnTrophy;
}

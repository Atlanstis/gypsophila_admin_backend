import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mhxy_area' })
export class MhxyArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 12 })
  name: string;

  @Column({ comment: '开服日期', type: 'date' })
  openDate: Date;
}

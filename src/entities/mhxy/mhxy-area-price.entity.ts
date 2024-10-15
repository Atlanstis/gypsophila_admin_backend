import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MhxyPropCategory } from './mhxy-prop-category.entity';
import { MhxyArea } from './mhxy-area.entity';

@Entity({ name: 'mhxy_area_price' })
export class MhxyAreaPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'statistical_date', comment: '统计日期', type: 'date' })
  statisticalDate: Date;

  @ManyToOne(() => MhxyArea, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'area_id' })
  area: MhxyArea;

  @ManyToOne(() => MhxyPropCategory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'prop_category_id' })
  propCategory: MhxyPropCategory;

  @Column({ type: 'int' })
  price: number;
}

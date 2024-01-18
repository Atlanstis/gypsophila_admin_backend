import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SETTING_LENGTH } from '../constants';

@Entity()
export class SystemSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: SETTING_LENGTH.KEY_MAX, comment: '键', unique: true })
  key: string;

  @Column({ length: SETTING_LENGTH.VALUE_MAX, nullable: true, comment: '值' })
  value: string;

  @Column({ length: SETTING_LENGTH.DESCRIPTION_MAX, nullable: true, comment: '描述' })
  description: string;
}

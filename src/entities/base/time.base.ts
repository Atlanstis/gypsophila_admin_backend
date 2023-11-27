import { BeforeUpdate, Column } from 'typeorm';

/** 记录数据时间 */
export class TimeBase {
  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeUpdate()
  updateDates() {
    this.updateTime = new Date();
  }
}

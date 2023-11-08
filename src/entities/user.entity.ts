import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 用户名 */
  @Column({ length: 16, comment: '用户名', unique: true })
  username: string;

  /** 密码 */
  @Column({ length: 128, comment: '密码' })
  password: string;

  @Column({ length: 10, comment: '昵称' })
  nickname: string;

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
}

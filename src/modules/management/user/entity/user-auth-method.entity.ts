import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

/** 登录方式 */
export enum AuthMethodTypeEnum {
  /** 密码登录 */
  password = 'password',
}

@Entity({ name: 'user_auth_method' })
export class UserAuthMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'method_type',
    comment: '登录方式',
    type: 'enum',
    enum: AuthMethodTypeEnum,
    default: AuthMethodTypeEnum.password,
  })
  methodType: AuthMethodTypeEnum;

  @Column({ name: 'password', comment: '密码', nullable: true })
  password: string;

  @ManyToOne(() => User, (user) => user.authMethods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @BeforeUpdate()
  updateDates() {
    this.updateTime = new Date();
  }
}

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeBase } from './base';
import { USER_LENGTH } from '../constants';
import { Role } from '../entities';

@Entity()
export class User extends TimeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 用户名 */
  @Column({ length: USER_LENGTH.USERNAME_MAX, comment: '用户名', unique: true })
  username: string;

  /** 头像地址 */
  @Column({ length: USER_LENGTH.AVATAR_MAX, nullable: true, comment: '头像地址' })
  avatar?: string;

  /** 密码 */
  @Column({ length: USER_LENGTH.PASSWORD_MAX, comment: '密码', select: false })
  password: string;

  /** 昵称 */
  @Column({ length: USER_LENGTH.NICKMAX_MAX, comment: '昵称' })
  nickname: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];
}

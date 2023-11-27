import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { TimeBase } from './base';

@Entity()
export class User extends TimeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 用户名 */
  @Column({ length: 16, comment: '用户名', unique: true })
  username: string;

  /** 头像地址 */
  @Column({ length: 128, nullable: true, comment: '头像地址' })
  avatar?: string;

  /** 密码 */
  @Column({ length: 128, comment: '密码', select: false })
  password: string;

  @Column({ length: 10, comment: '昵称' })
  nickname: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];
}

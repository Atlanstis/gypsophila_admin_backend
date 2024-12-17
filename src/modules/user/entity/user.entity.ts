import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserKeyLength } from '../constants';
import { UserAuthMethod } from './user-auth-method.entity';
import { Role } from 'src/entities';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 用户名 */
  @Column({
    name: 'username',
    length: UserKeyLength.usernameMax,
    comment: '用户名',
    unique: true,
  })
  username: string;

  /** 昵称 */
  @Column({
    name: 'nickname',
    length: UserKeyLength.nickNameMax,
    comment: '昵称',
  })
  nickname: string;

  @OneToMany(() => UserAuthMethod, (authMethod) => authMethod.user)
  authMethods: UserAuthMethod[];

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roles: Role[];

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

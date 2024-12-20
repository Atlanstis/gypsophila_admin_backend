import {
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu, User } from 'src/entities';
import { RoleConst } from '../constants';

export enum RoleStateEnum {
  /** 生效中 */
  active = 'active',
  /** 已失效 */
  inactive = 'inactive',
}

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'string',
    comment: '角色名',
    length: RoleConst.nameMax,
    unique: true,
  })
  name: string;

  @Column({
    name: 'desc',
    length: RoleConst.descMax,
    comment: '描述',
    default: '',
  })
  desc: string;

  @Column({
    name: 'is_builtin',
    type: 'tinyint',
    width: 1,
    comment: '是否为系统内置',
    default: 0,
  })
  isBuiltin: number;

  @Column({
    name: 'state',
    type: 'enum',
    comment: '状态',
    enum: RoleStateEnum,
    default: RoleStateEnum.active,
  })
  state: RoleStateEnum;

  @ManyToMany(() => Menu, (menu) => menu.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_menu',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'menu_id',
    },
  })
  menus: Menu[];

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  users: User[];

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

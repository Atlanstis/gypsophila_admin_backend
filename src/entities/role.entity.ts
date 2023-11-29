import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { TimeBase } from './base';
import { User } from './user.entity';

export enum RoleIsDefaultEnum {
  /** 内置角色 */
  YES = 1,
  /** 非内置角色 */
  NO = 0,
}

@Entity()
export class Role extends TimeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '角色名', length: 16, unique: true })
  name: string;

  @Column({
    name: 'is_default',
    type: 'enum',
    enum: RoleIsDefaultEnum,
    default: RoleIsDefaultEnum.NO,
    comment: '是否内置角色',
  })
  isDefault?: RoleIsDefaultEnum;

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'role_menu',
  })
  menus: Menu[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_role',
  })
  users: User[];
}

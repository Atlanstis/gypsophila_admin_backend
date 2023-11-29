import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { TimeBase } from './base';
import { User } from './user.entity';
import { ROLE_LENGTH, RoleIsDefaultEnum } from 'src/constants';

@Entity()
export class Role extends TimeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '角色名', length: ROLE_LENGTH.NAME_MAX, unique: true })
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

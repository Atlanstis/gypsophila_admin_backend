import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';

export enum RoleIsDefaultEnum {
  /** 内置角色 */
  YES = 1,
  /** 非内置角色 */
  NO = 0,
}

@Entity()
export class Role {
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

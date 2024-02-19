import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeNotSelectBase } from './base';
import { Menu } from './menu.entity';
import { PERMISSION_LENGTH, PermissionTypeMenu } from '../constants';

@Entity()
export class Permission extends TimeNotSelectBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: PERMISSION_LENGTH.KEY_MAX, comment: '权限标识', unique: true })
  key: string;

  @Column({ length: PERMISSION_LENGTH.NAME_MAX, comment: '权限名称' })
  name: string;

  @Column({
    type: 'enum',
    enum: PermissionTypeMenu,
    default: PermissionTypeMenu.Other,
    comment: '权限类型',
  })
  type: number;

  @JoinColumn({
    name: 'menu_id',
  })
  @ManyToOne(() => Menu, (menu) => menu.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  menu: Menu;
}

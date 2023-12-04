import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MENU_LENGTH, TOP_LEVEL_MENU_FLAG } from 'src/constants';
import { TimeNotSelectBase } from './base';
import { Permission } from './permission.entity';

@Entity()
export class Menu extends TimeNotSelectBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '菜单key', width: MENU_LENGTH.KEY_MAX, unique: true })
  key: string;

  @Column({ comment: '菜单名称', length: MENU_LENGTH.NAME_MAX })
  name: string;

  @Column({ name: 'parent_id', comment: '父菜单 id', type: 'int', default: TOP_LEVEL_MENU_FLAG })
  parentId: number;

  @OneToMany(() => Permission, (permission) => permission.menu)
  permissions: Permission[];
}

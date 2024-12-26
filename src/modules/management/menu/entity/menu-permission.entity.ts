import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from 'src/entities';
import { MenuPermissionConst } from '../constants';

@Entity({ name: 'menu_permission', orderBy: { order: 'ASC' } })
export class MenuPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'key',
    length: MenuPermissionConst.keyMax,
    comment: '权限标识',
    unique: true,
  })
  key: string;

  @Column({
    name: 'alias',
    length: MenuPermissionConst.aliasMax,
    comment: '别名',
  })
  alias: string;

  @Column({
    name: 'name',
    length: MenuPermissionConst.nameMax,
    comment: '权限名称',
  })
  name: string;

  @Column({
    name: 'order',
    comment: '排序',
    default: 0,
  })
  order: number;

  @Column({
    name: 'menu_id',
    comment: '菜单 id',
  })
  menuId: number;

  @JoinColumn({
    name: 'menu_id',
  })
  @ManyToOne(() => Menu, (menu) => menu.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  menu: Menu;
}

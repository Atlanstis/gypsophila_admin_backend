import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/entities';
import { MenuConst } from '../constants';
import { MenuPermission } from 'src/entities';

export enum MenuTypeEnum {
  'page' = 'page',
  'menu' = 'menu',
}

@Entity({ name: 'menu' })
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'key',
    comment: '菜单标识',
    length: MenuConst.keyMax,
    unique: true,
  })
  key: string;

  @Column({ name: 'name', comment: '菜单名称', length: MenuConst.nameMax })
  name: string;

  @Column({
    name: 'type',
    comment: '类型',
    type: 'enum',
    enum: MenuTypeEnum,
    default: MenuTypeEnum.page,
  })
  type: MenuTypeEnum;

  @Column({
    name: 'order',
    comment: '排序',
    default: 0,
  })
  order: number;

  @Column({
    name: 'path',
    comment: '路径',
    default: '',
  })
  path: string;

  @Column({
    name: 'icon',
    comment: '在线图标',
    nullable: true,
  })
  icon?: string;

  @Column({
    name: 'iconLocal',
    comment: '本地图标',
    nullable: true,
  })
  iconLocal?: string;

  @Column({
    name: 'view',
    comment: '视图',
    nullable: true,
  })
  view?: string;

  @Column({
    name: 'layout',
    comment: '布局',
    nullable: true,
  })
  layout?: string;

  @Column({
    name: 'keep_alive',
    comment: '缓存路由',
    nullable: true,
  })
  keepAlive?: boolean;

  @Column({
    name: 'hide_in_menu',
    comment: '菜单隐藏',
    nullable: true,
  })
  hideInMenu?: boolean;

  @Column({
    name: 'active_menu',
    comment: '激活时选中菜单',
    nullable: true,
  })
  activeMenu?: string;

  @Column({ nullable: true, name: 'parent_id' })
  parentId: number | null;

  @ManyToOne(() => Menu, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent: Menu;

  @OneToMany(() => Menu, (category) => category.parent)
  children: Menu[];

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];

  @OneToMany(() => MenuPermission, (permission) => permission.menu)
  permissions: MenuPermission[];

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

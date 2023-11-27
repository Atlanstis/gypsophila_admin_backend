import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeBase } from './base';

/** 顶级菜单 */
export const TOP_LEVEL_MENU_FLAG = 0;

export const MENU_KEY_MAX_LENGTH = 32;

export const MENU_NAME_MAX_LENGTH = 16;

@Entity()
export class Menu extends TimeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '菜单key', width: MENU_KEY_MAX_LENGTH, unique: true })
  key: string;

  @Column({ comment: '菜单名称', length: MENU_NAME_MAX_LENGTH })
  name: string;

  @Column({ name: 'parent_id', comment: '父菜单 id', type: 'int', default: TOP_LEVEL_MENU_FLAG })
  parentId: number;
}

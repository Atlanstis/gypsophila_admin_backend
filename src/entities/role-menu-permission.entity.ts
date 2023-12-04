import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Menu } from './menu.entity';
import { Role } from './role.entity';

@Entity({ name: 'role_menu_permission' })
export class RoleMenuPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({
    name: 'role_id',
  })
  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  @JoinColumn({
    name: 'menu_id',
  })
  @ManyToOne(() => Menu, (menu) => menu.id)
  menu: Menu;

  @JoinColumn({
    name: 'permission_id',
  })
  @ManyToOne(() => Permission, (permission) => permission.id)
  permission: Permission;
}

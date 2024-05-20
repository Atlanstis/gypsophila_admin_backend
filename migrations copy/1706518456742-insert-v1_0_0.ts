import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1021706518456742 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 用户数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`user\` (\`id\`, \`username\`, \`nickname\`, \`password\`, \`avatar\`) VALUES ('1d20f3f5-51f0-43ab-8147-804c772664a3', 'admin', '超级管理员', '$argon2id$v=19$m=65536,t=3,p=4$awhYFu9KmWwOFptjmb+1sQ$tizKwN8BIstcdsxP8VNkMSUvKvc9ZU+SPYc0oCyWSFc', '');`,
    );
    /** 角色数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role\` (\`id\`, \`name\`, \`is_default\`) VALUES (1, '超级管理员', '1');`,
    );
    /** 菜单数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (1, 'Workbench', '工作台', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (2, 'PlayStation', 'PlayStation', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (3, 'PlayStation_Profile', 'PSN 概览', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (4, 'PlayStation_Game', 'PSN 游戏', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (5, 'PlayStation_Search', '游戏查找', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (6, 'Management', '系统管理', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (7, 'Management_User', '用户管理', 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (8, 'Management_Role', '角色管理', 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (9, 'Management_Menu', '菜单管理', 6);`,
    );
    /** 菜单权限数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (1, 'UserList', '查看列表', '1', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (2, 'UserAdd', '新增', '2', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (3, 'UserEdit', '编辑', '3', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (4, 'UserDelete', '删除', '4', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (5, 'RoleList', '查看列表', '1', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (6, 'RoleAdd', '新增', '2', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (7, 'RoleEdit', '编辑', '3', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (8, 'RoleDelete', '删除', '4', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (9, 'RolePermission', '控制权限', '0', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (10, 'MenuList', '查看列表', '1', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (11, 'MenuAdd', '新增', '2', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (12, 'MenuEdit', '编辑', '3', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (13, 'MenuDelete', '删除', '4', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (14, 'MenuPermission', '操作权限', '0', 9);`,
    );
    /** 用户-角色绑定关系 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`user_role\` (\`userId\`, \`roleId\`) VALUES ('1d20f3f5-51f0-43ab-8147-804c772664a3', 1);`,
    );
    /** 角色-菜单绑定关系 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 3);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 4);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 9);`,
    );
    /** 角色-菜单-权限绑定关系 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 4);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 3);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 10);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 11);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 12);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 13);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 14);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`role_menu_permission\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`role_menu\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`user_role\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`role\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`user\``);
  }
}

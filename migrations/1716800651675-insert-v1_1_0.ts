import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1101716800651675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 新增工作台设置菜单 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (21, 'Workbench_Setting', '工作台设置', 1);`,
    );
    /** 添加超级管理员工作台设置菜单权限 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 21);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /** 删除超级管理员工作台设置菜单权限 */
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 21;`);
    /** 删除工作台设置菜单 */
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE \`menuId\` = 21 AND \`roleId\` = 1`,
    );
  }
}

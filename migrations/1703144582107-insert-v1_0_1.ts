import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertData1703144582107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 新增菜单 PlayStation_Analysis */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (10, 'PlayStation_Analysis', '游戏分析', 2);`,
    );
    /** PlayStation_Analysis 给予 admin 访问权限  */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 10);`,
    );
    /** 新增菜单 系统设置 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (11, 'Setting', '系统设置', 0);`,
    );
    /** 给予 admin 系统设置 访问权限  */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 11);`,
    );
    /** 新增菜单 通用设置 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (12, 'Setting_Common', '通用设置', 11);`,
    );
    /** 给予 admin 通用设置 访问权限  */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 12);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 10`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 11`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 12`);
  }
}

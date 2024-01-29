import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1021706518566070 implements MigrationInterface {
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
    /** 增加系统配置字段 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (1, 'WEBSITE_NAME', 'G 中文站', '网站名称');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (2, 'WEBSITE_RECORD_NUMBER', '', '备案号');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (3, 'WEBSITE_SHOW_RECORD_NUMBER', 'true', '是否显示备案号');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /** 删除系统配置 */
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\` WHERE \`id\` = 1`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\` WHERE \`id\` = 2`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\` WHERE \`id\` = 3`);
    /** 删除菜单 */
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 10`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 11`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 12`);
  }
}

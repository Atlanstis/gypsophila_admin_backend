import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1011705567620175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 增加网站设置的权限项 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (15, 'WebsiteSetting', '网站设置', '0', 12);`,
    );
    /** 给 admin 分配网站设置的权限 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 12, 15);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`role_menu_permission\`.\`permission\` WHERE \`role_id\` = 5 AND \`menu_id\` = 12 AND \`permission_id\` = 15`,
    );
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`permission\` WHERE \`id\` = 5`);
  }
}

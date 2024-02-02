import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1021706523974198 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** admin 账号增加 PSN 概览操作权限 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (16, 'PsnProfileOperation', '概览操作', '0', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 3, 16);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`permission\` WHERE \`id\` = 16`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1021706684977897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 新增 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (13, 'PlayStation_Profile_Game', '游戏概览', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 13);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` = 13`);
  }
}

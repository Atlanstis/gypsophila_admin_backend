import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1011705475873981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\` WHERE \`id\` = 1`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\` WHERE \`id\` = 2`);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\` WHERE \`id\` = 3`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1031708570548586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 新增梦幻西游菜单 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (14, 'Mhxy', '梦幻西游', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (15, 'Mhxy_Account', '账号一览', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 15);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` IN (14,15)`);
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 14) OR (\`roleId\` = 1 AND \`menuId\` = 15)`,
    );
  }
}

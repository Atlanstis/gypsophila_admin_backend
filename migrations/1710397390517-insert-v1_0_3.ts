import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1031710397390517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 新增梦幻西游菜单 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (14, 'Mhxy', '梦幻西游', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (15, 'Mhxy_Account', '账号一览', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (16, 'Mhxy_Gold_Record', '金币收支记录', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (17, 'Mhxy_Gold_Transfer', '转金', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (18, 'Mhxy_Prop_Category', '道具种类', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (19, 'Mhxy_Channel', '途径管理', 14);`,
    );
    /** 配置 admin 权限 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 15);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 16);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 17);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 18);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 19);`,
    );

    /** 添加配置 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (4, 'MHXY_TRADE_TAX', '9', '梦幻西游交易税率(%)');`,
    );

    /** 新增途径数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (1, 'DAILY', '日常', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (2, 'GOLD_TRANSFER', '转金', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (3, 'TRADE', '交易', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (4, 'ACTIVITY', '活动', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (5, 'SYSTEM', '系统', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (6, 'GOLD_LOCK', '金币被锁', 1, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (7, 'GOLD_UNLOCK', '金币解锁', 1, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`id\`, \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES (8, 'GOLD_DEDUCT', '金币被扣除', 1, 5);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`mhxy_channel\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\` WHERE (\`id\` = 4)`);
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 14)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 15)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 16)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 17)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 18)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 19)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` IN (14,15,16,17,18,19)`,
    );
  }
}

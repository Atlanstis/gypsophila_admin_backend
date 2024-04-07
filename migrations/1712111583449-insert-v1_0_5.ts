import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1051712111583449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (20, 'Schedule_Task', '定时任务', 11);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 20);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`schedule_task\` (\`key\`, \`name\`, \`description\`, \`cycle\`, \`status\`, \`last_run_time\`) VALUES ('MHXY_ACCOUNT_GOLD_DAILY', '梦幻西游账号金币统计', '按天为单位统计每个账号当前的金币数', '0 55 23 * * *', 'open', '2024-04-03 10:50:00');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`schedule_task\` WHERE (\`key\` = 'MHXY_ACCOUNT_GOLD_DAILY')`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 20)`,
    );
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` IN (20)`);
  }
}

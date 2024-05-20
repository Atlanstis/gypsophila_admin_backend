import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1061715303819231 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`schedule_task\` (\`key\`, \`name\`, \`description\`, \`cycle\`, \`status\`, \`last_run_time\`) VALUES ('MHXY_GOLD_TRANSFER_TODO_NOTIFY', '梦幻西游转金待办通知', '根据配置的转金策略生成待办通知', '5 0 0 * *', 'close', NULL);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`schedule_task\` (\`key\`, \`name\`, \`description\`, \`cycle\`, \`status\`, \`last_run_time\`) VALUES ('NOTICE_EXPIRE_CHECK', '通知过期检查', '检查通知是否过期', '5 0 0 * *', 'close', NULL);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`schedule_task\` WHERE (\`key\` = 'MHXY_GOLD_TRANSFER_TODO_NOTIFY')`,
    );
  }
}

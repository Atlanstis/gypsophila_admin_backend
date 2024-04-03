import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1051712111502954 implements MigrationInterface {
  name = 'CreateV1051712111502954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_gold_daily\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL COMMENT '统计日期', \`amount\` int NOT NULL COMMENT '金额' DEFAULT '0', \`account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedule_task_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`execution_time\` timestamp NOT NULL COMMENT '执行时间', \`consuming_time\` int NOT NULL COMMENT '耗时(秒)', \`status\` enum ('success', 'fail') NOT NULL COMMENT '执行状态' DEFAULT 'success', \`result\` text NOT NULL COMMENT '执行结果', \`schedule_task_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedule_task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NOT NULL COMMENT '任务唯一标识', \`name\` varchar(128) NOT NULL COMMENT '任务名称', \`description\` varchar(512) NULL COMMENT '任务描述', \`cycle\` varchar(32) NOT NULL COMMENT '执行周期', \`status\` enum ('inactive', 'open', 'inProgress', 'close') NOT NULL COMMENT '任务状态' DEFAULT 'inactive', \`last_run_time\` timestamp NULL COMMENT '上次执行时间', UNIQUE INDEX \`IDX_c7feefb5ef65f9fc251aff410e\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_daily\` ADD CONSTRAINT \`FK_dffc4fd147e8cc2b498e3aeefe0\` FOREIGN KEY (\`account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedule_task_log\` ADD CONSTRAINT \`FK_590752f2a28d6e4d11457ccd417\` FOREIGN KEY (\`schedule_task_id\`) REFERENCES \`schedule_task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`schedule_task_log\` DROP FOREIGN KEY \`FK_590752f2a28d6e4d11457ccd417\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_daily\` DROP FOREIGN KEY \`FK_dffc4fd147e8cc2b498e3aeefe0\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_c7feefb5ef65f9fc251aff410e\` ON \`schedule_task\``);
    await queryRunner.query(`DROP TABLE \`schedule_task\``);
    await queryRunner.query(`DROP TABLE \`schedule_task_log\``);
    await queryRunner.query(`DROP TABLE \`mhxy_account_gold_daily\``);
  }
}

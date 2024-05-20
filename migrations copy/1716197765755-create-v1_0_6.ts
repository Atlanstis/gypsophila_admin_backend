import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1061716197765755 implements MigrationInterface {
  name = 'CreateV1061716197765755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mhxy_gold_transfer_policy_apply\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('open', 'close') NOT NULL COMMENT '状态' DEFAULT 'open', \`next_execute_time\` date NULL COMMENT '下次执行时间', \`last_execute_time\` date NULL COMMENT '上次执行时间', \`account_id\` varchar(10) NULL COMMENT '账号 Id （官方）', \`policy_id\` int NOT NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_gold_transfer_policy\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(32) NOT NULL COMMENT '策略名称', \`quota\` int NOT NULL COMMENT '额度', \`cycle_by_day\` int NOT NULL COMMENT '周期(天)', \`prop_category_id\` int NOT NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notice\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(32) NOT NULL COMMENT '标题', \`description\` varchar(256) NULL COMMENT '描述', \`type\` enum ('Todo', 'Message') NOT NULL COMMENT '类型', \`category\` varchar(32) NULL COMMENT '种类', \`link\` json NULL COMMENT '关联信息', \`status\` enum ('Active', 'Handled', 'Expire') NOT NULL COMMENT '状态' DEFAULT 'Active', \`expire_time\` datetime NOT NULL COMMENT '过期时间' DEFAULT CURRENT_TIMESTAMP, \`create_time\` datetime NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_daily\` ADD \`change_amount\` int NOT NULL COMMENT '与前一日金额差额' DEFAULT '0'`,
    );
    await queryRunner.query(`DROP INDEX \`IDX_947bcf4f014dbed7655bee5ee5\` ON \`menu\``);
    await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`key\``);
    await queryRunner.query(`ALTER TABLE \`menu\` ADD \`key\` varchar(32) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`menu\` ADD UNIQUE INDEX \`IDX_947bcf4f014dbed7655bee5ee5\` (\`key\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`psn_trophy_group\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy_group\` ADD \`name\` varchar(128) NOT NULL COMMENT '名称'`,
    );
    await queryRunner.query(`DROP INDEX \`IDX_c8458bb0abcf3875cfbb03f1d9\` ON \`psn_profile\``);
    await queryRunner.query(`ALTER TABLE \`psn_profile\` DROP COLUMN \`psn_id\``);
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` ADD \`psn_id\` varchar(32) NOT NULL COMMENT 'Psn Id'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` ADD UNIQUE INDEX \`IDX_c8458bb0abcf3875cfbb03f1d9\` (\`psn_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`psn_profile\` DROP COLUMN \`avatar\``);
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` ADD \`avatar\` varchar(128) NOT NULL COMMENT '头像地址'`,
    );
    await queryRunner.query(`ALTER TABLE \`schedule_task_log\` DROP COLUMN \`consuming_time\``);
    await queryRunner.query(
      `ALTER TABLE \`schedule_task_log\` ADD \`consuming_time\` float NOT NULL COMMENT '耗时(秒)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` ADD CONSTRAINT \`FK_9af45ec14017db282c728a012a8\` FOREIGN KEY (\`account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` ADD CONSTRAINT \`FK_aa6dd82fd9f662983ff38cc8c2e\` FOREIGN KEY (\`policy_id\`) REFERENCES \`mhxy_gold_transfer_policy\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` ADD CONSTRAINT \`FK_585db3305cb67ccef8504cdc5a6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy\` ADD CONSTRAINT \`FK_25acd3982d25d760d500efd2948\` FOREIGN KEY (\`prop_category_id\`) REFERENCES \`mhxy_prop_category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy\` ADD CONSTRAINT \`FK_ef599067c7531bf44d333f4f1be\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notice\` ADD CONSTRAINT \`FK_3667d24b06587be480a9015d3b2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notice\` DROP FOREIGN KEY \`FK_3667d24b06587be480a9015d3b2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy\` DROP FOREIGN KEY \`FK_ef599067c7531bf44d333f4f1be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy\` DROP FOREIGN KEY \`FK_25acd3982d25d760d500efd2948\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` DROP FOREIGN KEY \`FK_585db3305cb67ccef8504cdc5a6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` DROP FOREIGN KEY \`FK_aa6dd82fd9f662983ff38cc8c2e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` DROP FOREIGN KEY \`FK_9af45ec14017db282c728a012a8\``,
    );
    await queryRunner.query(`ALTER TABLE \`schedule_task_log\` DROP COLUMN \`consuming_time\``);
    await queryRunner.query(
      `ALTER TABLE \`schedule_task_log\` ADD \`consuming_time\` int NOT NULL COMMENT '耗时(秒)'`,
    );
    await queryRunner.query(`ALTER TABLE \`psn_profile\` DROP COLUMN \`avatar\``);
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` ADD \`avatar\` varchar(255) NOT NULL COMMENT '头像地址'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` DROP INDEX \`IDX_c8458bb0abcf3875cfbb03f1d9\``,
    );
    await queryRunner.query(`ALTER TABLE \`psn_profile\` DROP COLUMN \`psn_id\``);
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` ADD \`psn_id\` varchar(255) NOT NULL COMMENT 'Psn Id'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_c8458bb0abcf3875cfbb03f1d9\` ON \`psn_profile\` (\`psn_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`psn_trophy_group\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy_group\` ADD \`name\` varchar(255) NOT NULL COMMENT '名称'`,
    );
    await queryRunner.query(`ALTER TABLE \`menu\` DROP INDEX \`IDX_947bcf4f014dbed7655bee5ee5\``);
    await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`key\``);
    await queryRunner.query(`ALTER TABLE \`menu\` ADD \`key\` varchar(255) NOT NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_947bcf4f014dbed7655bee5ee5\` ON \`menu\` (\`key\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_daily\` DROP COLUMN \`change_amount\``,
    );
    await queryRunner.query(`DROP TABLE \`notice\``);
    await queryRunner.query(`DROP TABLE \`mhxy_gold_transfer_policy\``);
    await queryRunner.query(`DROP TABLE \`mhxy_gold_transfer_policy_apply\``);
  }
}

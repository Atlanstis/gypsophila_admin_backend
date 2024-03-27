import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1041711527373170 implements MigrationInterface {
  name = 'CreateV1041711527373170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_group_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`remark\` text NULL COMMENT '备注', \`account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`account_group_id\` int NOT NULL, UNIQUE INDEX \`REL_e75d7b5a1a2e100dd01bc97937\` (\`account_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '名称', \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` ADD \`status\` enum ('active', 'banned') NOT NULL COMMENT '状态' DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group_item\` ADD CONSTRAINT \`FK_e75d7b5a1a2e100dd01bc979370\` FOREIGN KEY (\`account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group_item\` ADD CONSTRAINT \`FK_e3a030d537fc509ebe1a310e557\` FOREIGN KEY (\`account_group_id\`) REFERENCES \`mhxy_account_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group\` ADD CONSTRAINT \`FK_b0a6989f554d847d302dce2fa49\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group\` DROP FOREIGN KEY \`FK_b0a6989f554d847d302dce2fa49\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group_item\` DROP FOREIGN KEY \`FK_e3a030d537fc509ebe1a310e557\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group_item\` DROP FOREIGN KEY \`FK_e75d7b5a1a2e100dd01bc979370\``,
    );
    await queryRunner.query(`ALTER TABLE \`mhxy_account\` DROP COLUMN \`status\``);
    await queryRunner.query(`DROP TABLE \`mhxy_account_group\``);
    await queryRunner.query(
      `DROP INDEX \`REL_e75d7b5a1a2e100dd01bc97937\` ON \`mhxy_account_group_item\``,
    );
    await queryRunner.query(`DROP TABLE \`mhxy_account_group_item\``);
  }
}

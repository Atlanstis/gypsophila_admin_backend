import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1031708570542489 implements MigrationInterface {
  name = 'CreateV1031708570542489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`name\` varchar(16) NOT NULL COMMENT '账号名称', \`is_primary\` tinyint NOT NULL COMMENT '是否是主号' DEFAULT 0, \`role\` varchar(255) NOT NULL COMMENT '角色', \`sect\` varchar(255) NOT NULL COMMENT '门派', \`gold\` int NOT NULL COMMENT '金币数量' DEFAULT '0', \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` ADD CONSTRAINT \`FK_442b554c3276c9de7fb9027dfdc\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` DROP FOREIGN KEY \`FK_442b554c3276c9de7fb9027dfdc\``,
    );
    await queryRunner.query(`DROP TABLE \`mhxy_account\``);
  }
}

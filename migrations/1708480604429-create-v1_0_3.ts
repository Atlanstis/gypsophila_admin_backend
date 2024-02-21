import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1031708480604429 implements MigrationInterface {
  name = 'CreateV1031708480604429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '角色名', \`avatar\` varchar(128) NOT NULL COMMENT '头像地址', UNIQUE INDEX \`IDX_8b0b03422d9ef46a8750db2516\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_sect\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '门派名', \`thumbnail\` varchar(128) NOT NULL COMMENT '缩略图地址', UNIQUE INDEX \`IDX_ebc4fed2600c5867ccaae06997\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`name\` varchar(16) NOT NULL COMMENT '账号名称', \`is_primary\` tinyint NOT NULL COMMENT '是否是主号' DEFAULT 0, \`role_id\` int NULL, \`sect_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` ADD CONSTRAINT \`FK_a60a67462a512acf47d18acf1dd\` FOREIGN KEY (\`role_id\`) REFERENCES \`mhxy_account_role\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` ADD CONSTRAINT \`FK_131a9a1874634c3f6c8aafcbae3\` FOREIGN KEY (\`sect_id\`) REFERENCES \`mhxy_account_sect\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` DROP FOREIGN KEY \`FK_131a9a1874634c3f6c8aafcbae3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` DROP FOREIGN KEY \`FK_a60a67462a512acf47d18acf1dd\``,
    );
    await queryRunner.query(`DROP TABLE \`mhxy_account\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ebc4fed2600c5867ccaae06997\` ON \`mhxy_account_sect\``,
    );
    await queryRunner.query(`DROP TABLE \`mhxy_account_sect\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8b0b03422d9ef46a8750db2516\` ON \`mhxy_account_role\``,
    );
    await queryRunner.query(`DROP TABLE \`mhxy_account_role\``);
  }
}

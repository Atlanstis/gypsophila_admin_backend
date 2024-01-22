import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1021705651446692 implements MigrationInterface {
  name = 'CreateV1021705651446692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 创建 psn 信息表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_profile\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`psnId\` varchar(255) NOT NULL COMMENT 'Psn Id', \`avatar\` varchar(255) NOT NULL COMMENT '头像地址', \`platinum\` int NOT NULL COMMENT '白金奖杯数量' DEFAULT '0', \`gold\` int NOT NULL COMMENT '金奖杯数量' DEFAULT '0', \`silver\` int NOT NULL COMMENT '银奖杯数量' DEFAULT '0', \`bronze\` int NOT NULL COMMENT '铜奖杯数量' DEFAULT '0', \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_aaaf66028d29a6ce8cd0fe91d0\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` ADD CONSTRAINT \`FK_aaaf66028d29a6ce8cd0fe91d05\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` DROP FOREIGN KEY \`FK_aaaf66028d29a6ce8cd0fe91d05\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_aaaf66028d29a6ce8cd0fe91d0\` ON \`psn_profile\``);
    await queryRunner.query(`DROP TABLE \`psn_profile\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1021706518534207 implements MigrationInterface {
  name = 'CreateV1021706518534207';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`system_setting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NOT NULL COMMENT '键', \`value\` varchar(128) NULL COMMENT '值', \`description\` varchar(64) NULL COMMENT '描述', UNIQUE INDEX \`IDX_c6ce0e35b3c0d67dca93523ba1\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_c6ce0e35b3c0d67dca93523ba1\` ON \`system_setting\``);
    await queryRunner.query(`DROP TABLE \`system_setting\``);
  }
}

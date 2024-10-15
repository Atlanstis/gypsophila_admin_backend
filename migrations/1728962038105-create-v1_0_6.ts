import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1061728962038105 implements MigrationInterface {
  name = 'CreateV1061728962038105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mhxy_area\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(12) NOT NULL, \`openDate\` date NOT NULL COMMENT '开服日期', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_area_price\` (\`id\` int NOT NULL AUTO_INCREMENT, \`statistical_date\` date NOT NULL COMMENT '统计日期', \`price\` int NOT NULL, \`area_id\` int NOT NULL, \`prop_category_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_area_price\` ADD CONSTRAINT \`FK_7b2e3ac2eff2e6f44acf101cff3\` FOREIGN KEY (\`area_id\`) REFERENCES \`mhxy_area\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_area_price\` ADD CONSTRAINT \`FK_0ead96c73355630ba5eb4b2f39f\` FOREIGN KEY (\`prop_category_id\`) REFERENCES \`mhxy_prop_category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mhxy_area_price\` DROP FOREIGN KEY \`FK_0ead96c73355630ba5eb4b2f39f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_area_price\` DROP FOREIGN KEY \`FK_7b2e3ac2eff2e6f44acf101cff3\``,
    );
    await queryRunner.query(`DROP TABLE \`mhxy_area_price\``);
    await queryRunner.query(`DROP TABLE \`mhxy_area\``);
  }
}

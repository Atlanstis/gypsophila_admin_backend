import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1021706604394416 implements MigrationInterface {
  name = 'CreateV1021706604394416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game\` ADD \`favor_time\` timestamp NULL COMMENT '收藏时间'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`psn_profile_game\` DROP COLUMN \`favor_time\``);
  }
}

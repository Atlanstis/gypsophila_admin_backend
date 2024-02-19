import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1021708236062082 implements MigrationInterface {
  name = 'CreateV1021708236062082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`psn_profile_game_guide\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(64) NOT NULL COMMENT '标题', \`type\` enum ('url', 'text') NOT NULL COMMENT '类型' DEFAULT 'url', \`url\` varchar(128) NULL COMMENT 'url 地址', \`text\` text NULL COMMENT '文本内容', \`order\` int NOT NULL COMMENT '排序' DEFAULT '0', \`is_completed\` tinyint NOT NULL COMMENT '是否完成' DEFAULT 0, \`psn_profile_game_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_guide\` ADD CONSTRAINT \`FK_2dec92a66cb06e70121aed424ac\` FOREIGN KEY (\`psn_profile_game_id\`) REFERENCES \`psn_profile_game\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_guide\` DROP FOREIGN KEY \`FK_2dec92a66cb06e70121aed424ac\``,
    );
    await queryRunner.query(`DROP TABLE \`psn_profile_game_guide\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1021708322927761 implements MigrationInterface {
  name = 'CreateV1021708322927761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 创建 psn 游戏关联信息表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_game_link\` (\`id\` int NOT NULL AUTO_INCREMENT, \`psnine_id\` int NOT NULL COMMENT 'psnine 游戏Id', \`psnine_url\` varchar(128) NOT NULL COMMENT 'psnine 链接地址', \`psn_game_id\` int NULL, UNIQUE INDEX \`REL_80164c87676d1da9639665f10b\` (\`psn_game_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建 psn 游戏兼备关联信息表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_trophy_link\` (\`id\` int NOT NULL AUTO_INCREMENT, \`psnine_trophy_id\` int NOT NULL COMMENT 'psnine 奖杯 Id', \`psnine_url\` varchar(128) NOT NULL COMMENT 'psnine 链接地址', \`psn_trophy_id\` int NULL, UNIQUE INDEX \`REL_5c4bd8e6dc11bd20471efc45ab\` (\`psn_trophy_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建用户获得奖杯信息表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_profile_game_trophy\` (\`id\` int NOT NULL AUTO_INCREMENT, \`complete_time\` timestamp NULL COMMENT '获取时间', \`screenshot\` varchar(255) NULL COMMENT '跳杯截图', \`video\` varchar(255) NULL COMMENT '跳杯视频', \`psn_profile_game_id\` varchar(36) NULL, \`psn_trophy_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建 psn 游戏奖杯表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_trophy\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`order\` int NOT NULL COMMENT '顺序', \`name\` varchar(128) NOT NULL COMMENT '名称', \`description\` varchar(128) NOT NULL COMMENT '描述', \`thumbnail\` varchar(255) NOT NULL COMMENT '缩略图', \`type\` enum ('platinum', 'gold', 'silver', 'bronze') NOT NULL COMMENT '奖杯类型', \`psn_trophy_group_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建 psn 游戏奖杯组表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_trophy_group\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL COMMENT '名称', \`thumbnail\` varchar(255) NOT NULL COMMENT '缩略图', \`is_dlc\` tinyint NOT NULL COMMENT '是否 DLC', \`platinum\` int NOT NULL COMMENT '白金奖杯数', \`gold\` int NOT NULL COMMENT '金奖杯数', \`silver\` int NOT NULL COMMENT '银奖杯数', \`bronze\` int NOT NULL COMMENT '铜奖杯数', \`psn_game_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建 psn 游戏表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_game\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(128) NOT NULL COMMENT '游戏名称', \`origin_name\` varchar(128) NOT NULL COMMENT '游戏原名', \`thumbnail\` varchar(255) NOT NULL COMMENT '缩略图', \`platforms\` text NOT NULL COMMENT '支持平台', \`platinum\` int NOT NULL COMMENT '白金奖杯数', \`gold\` int NOT NULL COMMENT '金奖杯数', \`silver\` int NOT NULL COMMENT '银奖杯数', \`bronze\` int NOT NULL COMMENT '铜奖杯数', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建用户游戏攻略表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_profile_game_guide\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(64) NOT NULL COMMENT '标题', \`type\` enum ('url', 'text') NOT NULL COMMENT '类型' DEFAULT 'url', \`url\` varchar(128) NULL COMMENT 'url 地址', \`text\` text NULL COMMENT '文本内容', \`order\` int NOT NULL COMMENT '排序' DEFAULT '0', \`is_completed\` tinyint NOT NULL COMMENT '是否完成' DEFAULT 0, \`psn_profile_game_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建用户游戏表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_profile_game\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(36) NOT NULL, \`is_favor\` tinyint NOT NULL COMMENT '是否收藏' DEFAULT 0, \`favor_time\` timestamp NULL COMMENT '收藏时间', \`sync_time\` timestamp NOT NULL COMMENT '同步时间' DEFAULT CURRENT_TIMESTAMP, \`platinum_got\` int NOT NULL COMMENT '获得白金奖杯数量' DEFAULT '0', \`gold_got\` int NOT NULL COMMENT '获得金奖杯数量' DEFAULT '0', \`silver_got\` int NOT NULL COMMENT '获得银奖杯数量' DEFAULT '0', \`bronze_got\` int NOT NULL COMMENT '获得铜奖杯数量' DEFAULT '0', \`psn_profile_id\` int NULL, \`psn_game_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建用户信息表 */
    await queryRunner.query(
      `CREATE TABLE \`psn_profile\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`psn_id\` varchar(255) NOT NULL COMMENT 'Psn Id', \`avatar\` varchar(255) NOT NULL COMMENT '头像地址', \`platinum\` int NOT NULL COMMENT '白金奖杯数量' DEFAULT '0', \`gold\` int NOT NULL COMMENT '金奖杯数量' DEFAULT '0', \`silver\` int NOT NULL COMMENT '银奖杯数量' DEFAULT '0', \`bronze\` int NOT NULL COMMENT '铜奖杯数量' DEFAULT '0', \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_c8458bb0abcf3875cfbb03f1d9\` (\`psn_id\`), UNIQUE INDEX \`REL_aaaf66028d29a6ce8cd0fe91d0\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_game_link\` ADD CONSTRAINT \`FK_80164c87676d1da9639665f10b9\` FOREIGN KEY (\`psn_game_id\`) REFERENCES \`psn_game\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy_link\` ADD CONSTRAINT \`FK_5c4bd8e6dc11bd20471efc45abf\` FOREIGN KEY (\`psn_trophy_id\`) REFERENCES \`psn_trophy\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_trophy\` ADD CONSTRAINT \`FK_0e1147b967eedc414eff3c4a52a\` FOREIGN KEY (\`psn_profile_game_id\`) REFERENCES \`psn_profile_game\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_trophy\` ADD CONSTRAINT \`FK_da1a1367c38734b73c0167f841d\` FOREIGN KEY (\`psn_trophy_id\`) REFERENCES \`psn_trophy\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy\` ADD CONSTRAINT \`FK_9abe87f1a399f62198624c12df6\` FOREIGN KEY (\`psn_trophy_group_id\`) REFERENCES \`psn_trophy_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy_group\` ADD CONSTRAINT \`FK_18aa96390b4b80a86daefa8d455\` FOREIGN KEY (\`psn_game_id\`) REFERENCES \`psn_game\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_guide\` ADD CONSTRAINT \`FK_2dec92a66cb06e70121aed424ac\` FOREIGN KEY (\`psn_profile_game_id\`) REFERENCES \`psn_profile_game\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game\` ADD CONSTRAINT \`FK_a75608e91af07ad352398860fe6\` FOREIGN KEY (\`psn_profile_id\`) REFERENCES \`psn_profile\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game\` ADD CONSTRAINT \`FK_b691f90dd3c722bf24c26042188\` FOREIGN KEY (\`psn_game_id\`) REFERENCES \`psn_game\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` ADD CONSTRAINT \`FK_aaaf66028d29a6ce8cd0fe91d05\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`psn_profile\` DROP FOREIGN KEY \`FK_aaaf66028d29a6ce8cd0fe91d05\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game\` DROP FOREIGN KEY \`FK_b691f90dd3c722bf24c26042188\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game\` DROP FOREIGN KEY \`FK_a75608e91af07ad352398860fe6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_guide\` DROP FOREIGN KEY \`FK_2dec92a66cb06e70121aed424ac\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy_group\` DROP FOREIGN KEY \`FK_18aa96390b4b80a86daefa8d455\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy\` DROP FOREIGN KEY \`FK_9abe87f1a399f62198624c12df6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_trophy\` DROP FOREIGN KEY \`FK_da1a1367c38734b73c0167f841d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_profile_game_trophy\` DROP FOREIGN KEY \`FK_0e1147b967eedc414eff3c4a52a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_trophy_link\` DROP FOREIGN KEY \`FK_5c4bd8e6dc11bd20471efc45abf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`psn_game_link\` DROP FOREIGN KEY \`FK_80164c87676d1da9639665f10b9\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_aaaf66028d29a6ce8cd0fe91d0\` ON \`psn_profile\``);
    await queryRunner.query(`DROP INDEX \`IDX_c8458bb0abcf3875cfbb03f1d9\` ON \`psn_profile\``);
    await queryRunner.query(`DROP TABLE \`psn_profile\``);
    await queryRunner.query(`DROP TABLE \`psn_profile_game\``);
    await queryRunner.query(`DROP TABLE \`psn_profile_game_guide\``);
    await queryRunner.query(`DROP TABLE \`psn_game\``);
    await queryRunner.query(`DROP TABLE \`psn_trophy_group\``);
    await queryRunner.query(`DROP TABLE \`psn_trophy\``);
    await queryRunner.query(`DROP TABLE \`psn_profile_game_trophy\``);
    await queryRunner.query(`DROP INDEX \`REL_5c4bd8e6dc11bd20471efc45ab\` ON \`psn_trophy_link\``);
    await queryRunner.query(`DROP TABLE \`psn_trophy_link\``);
    await queryRunner.query(`DROP INDEX \`REL_80164c87676d1da9639665f10b\` ON \`psn_game_link\``);
    await queryRunner.query(`DROP TABLE \`psn_game_link\``);
  }
}

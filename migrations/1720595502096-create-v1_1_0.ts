import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1101720595502096 implements MigrationInterface {
  name = 'CreateV1101720595502096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(36) NOT NULL, \`username\` varchar(16) NOT NULL COMMENT '用户名', \`avatar\` varchar(128) NULL COMMENT '头像地址', \`password\` varchar(128) NOT NULL COMMENT '密码', \`nickname\` varchar(10) NOT NULL COMMENT '昵称', UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NOT NULL COMMENT '权限标识', \`name\` varchar(16) NOT NULL COMMENT '权限名称', \`type\` enum ('1', '2', '3', '4', '0') NOT NULL COMMENT '权限类型' DEFAULT '0', \`menu_id\` int NULL, UNIQUE INDEX \`IDX_20ff45fefbd3a7c04d2572c3bb\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`menu\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NOT NULL, \`name\` varchar(16) NOT NULL COMMENT '菜单名称', \`parent_id\` int NOT NULL COMMENT '父菜单 id' DEFAULT '0', UNIQUE INDEX \`IDX_947bcf4f014dbed7655bee5ee5\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '角色名', \`is_default\` enum ('1', '0') NOT NULL COMMENT '是否内置角色' DEFAULT '0', UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_menu_permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role_id\` int NULL, \`menu_id\` int NULL, \`permission_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`system_setting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NOT NULL COMMENT '键', \`value\` varchar(128) NULL COMMENT '值', \`description\` varchar(64) NULL COMMENT '描述', UNIQUE INDEX \`IDX_c6ce0e35b3c0d67dca93523ba1\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_game_link\` (\`id\` int NOT NULL AUTO_INCREMENT, \`psnine_id\` int NOT NULL COMMENT 'psnine 游戏Id', \`psnine_url\` varchar(128) NOT NULL COMMENT 'psnine 链接地址', \`psn_game_id\` int NULL, UNIQUE INDEX \`REL_80164c87676d1da9639665f10b\` (\`psn_game_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_trophy_link\` (\`id\` int NOT NULL AUTO_INCREMENT, \`psnine_trophy_id\` int NOT NULL COMMENT 'psnine 奖杯 Id', \`psnine_url\` varchar(128) NOT NULL COMMENT 'psnine 链接地址', \`psn_trophy_id\` int NULL, UNIQUE INDEX \`REL_5c4bd8e6dc11bd20471efc45ab\` (\`psn_trophy_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_profile_game_trophy\` (\`id\` int NOT NULL AUTO_INCREMENT, \`complete_time\` timestamp NULL COMMENT '获取时间', \`screenshot\` varchar(255) NULL COMMENT '跳杯截图', \`video\` varchar(255) NULL COMMENT '跳杯视频', \`psn_profile_game_id\` varchar(36) NULL, \`psn_trophy_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_trophy\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`order\` int NOT NULL COMMENT '顺序', \`name\` varchar(128) NOT NULL COMMENT '名称', \`description\` varchar(128) NOT NULL COMMENT '描述', \`thumbnail\` varchar(255) NOT NULL COMMENT '缩略图', \`type\` enum ('platinum', 'gold', 'silver', 'bronze') NOT NULL COMMENT '奖杯类型', \`psn_trophy_group_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_trophy_group\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(128) NOT NULL COMMENT '名称', \`thumbnail\` varchar(255) NOT NULL COMMENT '缩略图', \`is_dlc\` tinyint NOT NULL COMMENT '是否 DLC', \`platinum\` int NOT NULL COMMENT '白金奖杯数', \`gold\` int NOT NULL COMMENT '金奖杯数', \`silver\` int NOT NULL COMMENT '银奖杯数', \`bronze\` int NOT NULL COMMENT '铜奖杯数', \`psn_game_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_game\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(128) NOT NULL COMMENT '游戏名称', \`origin_name\` varchar(128) NOT NULL COMMENT '游戏原名', \`thumbnail\` varchar(255) NOT NULL COMMENT '缩略图', \`platforms\` text NOT NULL COMMENT '支持平台', \`platinum\` int NOT NULL COMMENT '白金奖杯数', \`gold\` int NOT NULL COMMENT '金奖杯数', \`silver\` int NOT NULL COMMENT '银奖杯数', \`bronze\` int NOT NULL COMMENT '铜奖杯数', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_profile_game_guide\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(64) NOT NULL COMMENT '标题', \`type\` enum ('url', 'text') NOT NULL COMMENT '类型' DEFAULT 'url', \`url\` varchar(128) NULL COMMENT 'url 地址', \`text\` text NULL COMMENT '文本内容', \`order\` int NOT NULL COMMENT '排序' DEFAULT '0', \`is_completed\` tinyint NOT NULL COMMENT '是否完成' DEFAULT 0, \`psn_profile_game_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_profile_game\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(36) NOT NULL, \`is_favor\` tinyint NOT NULL COMMENT '是否收藏' DEFAULT 0, \`favor_time\` timestamp NULL COMMENT '收藏时间', \`sync_time\` timestamp NOT NULL COMMENT '同步时间' DEFAULT CURRENT_TIMESTAMP, \`platinum_got\` int NOT NULL COMMENT '获得白金奖杯数量' DEFAULT '0', \`gold_got\` int NOT NULL COMMENT '获得金奖杯数量' DEFAULT '0', \`silver_got\` int NOT NULL COMMENT '获得银奖杯数量' DEFAULT '0', \`bronze_got\` int NOT NULL COMMENT '获得铜奖杯数量' DEFAULT '0', \`psn_profile_id\` int NULL, \`psn_game_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`psn_profile\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`psn_id\` varchar(32) NOT NULL COMMENT 'Psn Id', \`avatar\` varchar(128) NOT NULL COMMENT '头像地址', \`platinum\` int NOT NULL COMMENT '白金奖杯数量' DEFAULT '0', \`gold\` int NOT NULL COMMENT '金奖杯数量' DEFAULT '0', \`silver\` int NOT NULL COMMENT '银奖杯数量' DEFAULT '0', \`bronze\` int NOT NULL COMMENT '铜奖杯数量' DEFAULT '0', \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_c8458bb0abcf3875cfbb03f1d9\` (\`psn_id\`), UNIQUE INDEX \`REL_aaaf66028d29a6ce8cd0fe91d0\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedule_task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NOT NULL COMMENT '任务唯一标识', \`name\` varchar(128) NOT NULL COMMENT '任务名称', \`description\` varchar(512) NULL COMMENT '任务描述', \`cycle\` varchar(32) NOT NULL COMMENT '执行周期', \`status\` enum ('inactive', 'open', 'inProgress', 'close') NOT NULL COMMENT '任务状态' DEFAULT 'inactive', \`last_run_time\` timestamp NULL COMMENT '上次执行时间', UNIQUE INDEX \`IDX_c7feefb5ef65f9fc251aff410e\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedule_task_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`execution_time\` timestamp NOT NULL COMMENT '执行时间', \`consuming_time\` float NOT NULL COMMENT '耗时(秒)', \`status\` enum ('success', 'fail') NOT NULL COMMENT '执行状态' DEFAULT 'success', \`result\` text NOT NULL COMMENT '执行结果', \`schedule_task_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notice\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(32) NOT NULL COMMENT '标题', \`description\` varchar(256) NULL COMMENT '描述', \`type\` enum ('Todo', 'Message') NOT NULL COMMENT '类型', \`category\` varchar(32) NULL COMMENT '种类', \`link\` json NULL COMMENT '关联信息', \`status\` enum ('Active', 'Handled', 'Expire') NOT NULL COMMENT '状态' DEFAULT 'Active', \`expire_time\` datetime NOT NULL COMMENT '过期时间' DEFAULT CURRENT_TIMESTAMP, \`create_time\` datetime NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role\` (\`userId\` varchar(36) NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` (\`userId\`), INDEX \`IDX_dba55ed826ef26b5b22bd39409\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_menu\` (\`roleId\` int NOT NULL, \`menuId\` int NOT NULL, INDEX \`IDX_4a57845f090fb832eeac3e3486\` (\`roleId\`), INDEX \`IDX_ed7dbf72cc845b0c9150a67851\` (\`menuId\`), PRIMARY KEY (\`roleId\`, \`menuId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permission\` ADD CONSTRAINT \`FK_b4083bde507bb8b760a2aaf9c08\` FOREIGN KEY (\`menu_id\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu_permission\` ADD CONSTRAINT \`FK_636978ae05637a0d5318e836c6a\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu_permission\` ADD CONSTRAINT \`FK_5b7e1e9365298e5f9da0d30b781\` FOREIGN KEY (\`menu_id\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu_permission\` ADD CONSTRAINT \`FK_5b71be11007b819e4a3dad6d6c1\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
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
    await queryRunner.query(
      `ALTER TABLE \`schedule_task_log\` ADD CONSTRAINT \`FK_590752f2a28d6e4d11457ccd417\` FOREIGN KEY (\`schedule_task_id\`) REFERENCES \`schedule_task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notice\` ADD CONSTRAINT \`FK_3667d24b06587be480a9015d3b2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_4a57845f090fb832eeac3e34860\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_ed7dbf72cc845b0c9150a678512\` FOREIGN KEY (\`menuId\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_ed7dbf72cc845b0c9150a678512\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_4a57845f090fb832eeac3e34860\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notice\` DROP FOREIGN KEY \`FK_3667d24b06587be480a9015d3b2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedule_task_log\` DROP FOREIGN KEY \`FK_590752f2a28d6e4d11457ccd417\``,
    );
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
    await queryRunner.query(
      `ALTER TABLE \`role_menu_permission\` DROP FOREIGN KEY \`FK_5b71be11007b819e4a3dad6d6c1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu_permission\` DROP FOREIGN KEY \`FK_5b7e1e9365298e5f9da0d30b781\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu_permission\` DROP FOREIGN KEY \`FK_636978ae05637a0d5318e836c6a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_b4083bde507bb8b760a2aaf9c08\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_ed7dbf72cc845b0c9150a67851\` ON \`role_menu\``);
    await queryRunner.query(`DROP INDEX \`IDX_4a57845f090fb832eeac3e3486\` ON \`role_menu\``);
    await queryRunner.query(`DROP TABLE \`role_menu\``);
    await queryRunner.query(`DROP INDEX \`IDX_dba55ed826ef26b5b22bd39409\` ON \`user_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` ON \`user_role\``);
    await queryRunner.query(`DROP TABLE \`user_role\``);
    await queryRunner.query(`DROP TABLE \`notice\``);
    await queryRunner.query(`DROP TABLE \`schedule_task_log\``);
    await queryRunner.query(`DROP INDEX \`IDX_c7feefb5ef65f9fc251aff410e\` ON \`schedule_task\``);
    await queryRunner.query(`DROP TABLE \`schedule_task\``);
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
    await queryRunner.query(`DROP INDEX \`IDX_c6ce0e35b3c0d67dca93523ba1\` ON \`system_setting\``);
    await queryRunner.query(`DROP TABLE \`system_setting\``);
    await queryRunner.query(`DROP TABLE \`role_menu_permission\``);
    await queryRunner.query(`DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP INDEX \`IDX_947bcf4f014dbed7655bee5ee5\` ON \`menu\``);
    await queryRunner.query(`DROP TABLE \`menu\``);
    await queryRunner.query(`DROP INDEX \`IDX_20ff45fefbd3a7c04d2572c3bb\` ON \`permission\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
    await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}

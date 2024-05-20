import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1061716198320286 implements MigrationInterface {
  name = 'CreateV1061716198320286';

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
      `CREATE TABLE \`mhxy_account\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`name\` varchar(16) NOT NULL COMMENT '账号名称', \`is_primary\` tinyint NOT NULL COMMENT '是否是主号' DEFAULT 0, \`role\` varchar(255) NOT NULL COMMENT '角色', \`sect\` varchar(255) NOT NULL COMMENT '门派', \`gold\` int NOT NULL COMMENT '金币数量' DEFAULT '0', \`lock_gold\` int NOT NULL COMMENT '被锁金币数量' DEFAULT '0', \`status\` enum ('active', 'banned') NOT NULL COMMENT '状态' DEFAULT 'active', \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_prop_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '名称', \`isGem\` tinyint NOT NULL COMMENT '是否为珍品' DEFAULT 0, \`parentId\` int NOT NULL COMMENT '父级 id' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NULL COMMENT '途径 key，唯一，用于业务判断', \`name\` varchar(16) NOT NULL COMMENT '名称', \`is_default\` tinyint NOT NULL COMMENT '是否默认' DEFAULT 0, \`parent_id\` int NOT NULL COMMENT '父级 id' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_gold_transfer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`expenditure_amount\` int NOT NULL COMMENT '支出金额' DEFAULT '0', \`revenue_amount\` int NOT NULL COMMENT '收入金额' DEFAULT '0', \`status\` enum ('progress', 'success', 'fail_from_lock') NOT NULL COMMENT '状态' DEFAULT 'progress', \`create_time\` timestamp NOT NULL COMMENT '转金时间' DEFAULT CURRENT_TIMESTAMP, \`from_account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`to_account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`prop_category_id\` int NOT NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_gold_record\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` int NOT NULL COMMENT '数额' DEFAULT '0', \`type\` enum ('expenditure', 'revenue') NOT NULL COMMENT '收支类型: expenditure-支出,revenue-收入' DEFAULT 'revenue', \`status\` int NOT NULL COMMENT '状态: 0-进行中,1-已完成' DEFAULT '1', \`remark\` varchar(256) NOT NULL COMMENT '备注' DEFAULT '', \`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`channel_id\` int NOT NULL, \`prop_category_id\` int NULL, \`account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`user_id\` varchar(36) NOT NULL, \`transfer_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_group_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`remark\` text NULL COMMENT '备注', \`account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`account_group_id\` int NOT NULL, UNIQUE INDEX \`REL_e75d7b5a1a2e100dd01bc97937\` (\`account_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '名称', \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_account_gold_daily\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL COMMENT '统计日期', \`amount\` int NOT NULL COMMENT '金额' DEFAULT '0', \`change_amount\` int NOT NULL COMMENT '与前一日金额差额' DEFAULT '0', \`account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_gold_transfer_policy_apply\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('open', 'close') NOT NULL COMMENT '状态' DEFAULT 'open', \`next_execute_time\` date NULL COMMENT '下次执行时间', \`last_execute_time\` date NULL COMMENT '上次执行时间', \`account_id\` varchar(10) NULL COMMENT '账号 Id （官方）', \`policy_id\` int NOT NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mhxy_gold_transfer_policy\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(32) NOT NULL COMMENT '策略名称', \`quota\` int NOT NULL COMMENT '额度', \`cycle_by_day\` int NOT NULL COMMENT '周期(天)', \`prop_category_id\` int NOT NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
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
      `ALTER TABLE \`mhxy_account\` ADD CONSTRAINT \`FK_442b554c3276c9de7fb9027dfdc\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_2db0cd7c503f7ea4ddc8757b309\` FOREIGN KEY (\`from_account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_f5f629d153c8af1cad4c9ef9cb9\` FOREIGN KEY (\`to_account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_c6a5aaa8b384c27681760ad93a1\` FOREIGN KEY (\`prop_category_id\`) REFERENCES \`mhxy_prop_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_ea41098e06586a02cb6dbbf90dd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_e4614aebda1aa83a773726cb279\` FOREIGN KEY (\`channel_id\`) REFERENCES \`mhxy_channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_305892470ab45eb2d45ce6e8c20\` FOREIGN KEY (\`prop_category_id\`) REFERENCES \`mhxy_prop_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_94be1b29ff282df31b76b0eeaa6\` FOREIGN KEY (\`account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_230638822b841d9f583c3ae188e\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_1f81e8bcab12fb276d778c739be\` FOREIGN KEY (\`transfer_id\`) REFERENCES \`mhxy_account_gold_transfer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
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
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_daily\` ADD CONSTRAINT \`FK_dffc4fd147e8cc2b498e3aeefe0\` FOREIGN KEY (\`account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` ADD CONSTRAINT \`FK_9af45ec14017db282c728a012a8\` FOREIGN KEY (\`account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` ADD CONSTRAINT \`FK_aa6dd82fd9f662983ff38cc8c2e\` FOREIGN KEY (\`policy_id\`) REFERENCES \`mhxy_gold_transfer_policy\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` ADD CONSTRAINT \`FK_585db3305cb67ccef8504cdc5a6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy\` ADD CONSTRAINT \`FK_25acd3982d25d760d500efd2948\` FOREIGN KEY (\`prop_category_id\`) REFERENCES \`mhxy_prop_category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy\` ADD CONSTRAINT \`FK_ef599067c7531bf44d333f4f1be\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
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
      `ALTER TABLE \`mhxy_gold_transfer_policy\` DROP FOREIGN KEY \`FK_ef599067c7531bf44d333f4f1be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy\` DROP FOREIGN KEY \`FK_25acd3982d25d760d500efd2948\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` DROP FOREIGN KEY \`FK_585db3305cb67ccef8504cdc5a6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` DROP FOREIGN KEY \`FK_aa6dd82fd9f662983ff38cc8c2e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_gold_transfer_policy_apply\` DROP FOREIGN KEY \`FK_9af45ec14017db282c728a012a8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_daily\` DROP FOREIGN KEY \`FK_dffc4fd147e8cc2b498e3aeefe0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group\` DROP FOREIGN KEY \`FK_b0a6989f554d847d302dce2fa49\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group_item\` DROP FOREIGN KEY \`FK_e3a030d537fc509ebe1a310e557\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_group_item\` DROP FOREIGN KEY \`FK_e75d7b5a1a2e100dd01bc979370\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_1f81e8bcab12fb276d778c739be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_230638822b841d9f583c3ae188e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_94be1b29ff282df31b76b0eeaa6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_305892470ab45eb2d45ce6e8c20\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_e4614aebda1aa83a773726cb279\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_ea41098e06586a02cb6dbbf90dd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_c6a5aaa8b384c27681760ad93a1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_f5f629d153c8af1cad4c9ef9cb9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_2db0cd7c503f7ea4ddc8757b309\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mhxy_account\` DROP FOREIGN KEY \`FK_442b554c3276c9de7fb9027dfdc\``,
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
    await queryRunner.query(`DROP TABLE \`mhxy_gold_transfer_policy\``);
    await queryRunner.query(`DROP TABLE \`mhxy_gold_transfer_policy_apply\``);
    await queryRunner.query(`DROP TABLE \`mhxy_account_gold_daily\``);
    await queryRunner.query(`DROP TABLE \`mhxy_account_group\``);
    await queryRunner.query(
      `DROP INDEX \`REL_e75d7b5a1a2e100dd01bc97937\` ON \`mhxy_account_group_item\``,
    );
    await queryRunner.query(`DROP TABLE \`mhxy_account_group_item\``);
    await queryRunner.query(`DROP TABLE \`mhxy_account_gold_record\``);
    await queryRunner.query(`DROP TABLE \`mhxy_account_gold_transfer\``);
    await queryRunner.query(`DROP TABLE \`mhxy_channel\``);
    await queryRunner.query(`DROP TABLE \`mhxy_prop_category\``);
    await queryRunner.query(`DROP TABLE \`mhxy_account\``);
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

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1061716198335762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 用户数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`user\` (\`id\`, \`username\`, \`nickname\`, \`password\`, \`avatar\`) VALUES ('1d20f3f5-51f0-43ab-8147-804c772664a3', 'admin', '超级管理员', '$argon2id$v=19$m=65536,t=3,p=4$awhYFu9KmWwOFptjmb+1sQ$tizKwN8BIstcdsxP8VNkMSUvKvc9ZU+SPYc0oCyWSFc', '');`,
    );
    /** 角色数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role\` (\`id\`, \`name\`, \`is_default\`) VALUES (1, '超级管理员', '1');`,
    );
    /** 菜单数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (1, 'Workbench', '工作台', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (2, 'PlayStation', 'PlayStation', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (3, 'PlayStation_Profile', 'PSN 概览', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (4, 'PlayStation_Game', 'PSN 游戏', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (5, 'PlayStation_Search', '游戏查找', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (6, 'Management', '系统管理', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (7, 'Management_User', '用户管理', 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (8, 'Management_Role', '角色管理', 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (9, 'Management_Menu', '菜单管理', 6);`,
    );
    /** 菜单权限数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (1, 'UserList', '查看列表', '1', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (2, 'UserAdd', '新增', '2', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (3, 'UserEdit', '编辑', '3', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (4, 'UserDelete', '删除', '4', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (5, 'RoleList', '查看列表', '1', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (6, 'RoleAdd', '新增', '2', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (7, 'RoleEdit', '编辑', '3', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (8, 'RoleDelete', '删除', '4', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (9, 'RolePermission', '控制权限', '0', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (10, 'MenuList', '查看列表', '1', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (11, 'MenuAdd', '新增', '2', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (12, 'MenuEdit', '编辑', '3', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (13, 'MenuDelete', '删除', '4', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (14, 'MenuPermission', '操作权限', '0', 9);`,
    );
    /** 用户-角色绑定关系 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`user_role\` (\`userId\`, \`roleId\`) VALUES ('1d20f3f5-51f0-43ab-8147-804c772664a3', 1);`,
    );
    /** 角色-菜单绑定关系 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 3);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 4);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 9);`,
    );
    /** 角色-菜单-权限绑定关系 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 4);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 3);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 7, 2);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 6);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 7);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 8);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 8, 9);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 10);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 11);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 12);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 13);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 9, 14);`,
    );
    /** 新增菜单 PlayStation_Analysis */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (10, 'PlayStation_Analysis', '游戏分析', 2);`,
    );
    /** PlayStation_Analysis 给予 admin 访问权限  */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 10);`,
    );
    /** 新增菜单 系统设置 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (11, 'Setting', '系统设置', 0);`,
    );
    /** 给予 admin 系统设置 访问权限  */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 11);`,
    );
    /** 新增菜单 通用设置 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (12, 'Setting_Common', '通用设置', 11);`,
    );
    /** 给予 admin 通用设置 访问权限  */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 12);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (15, 'WebsiteSetting', '网站设置', '0', 12);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 12, 15);`,
    );
    /** 增加系统配置字段 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (1, 'WEBSITE_NAME', 'G中文站', '网站名称');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (2, 'WEBSITE_RECORD_NUMBER', '', '备案号');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (3, 'WEBSITE_SHOW_RECORD_NUMBER', 'true', '是否显示备案号');`,
    );
    /** admin 账号增加 PSN 概览操作权限 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`permission\` (\`id\`, \`key\`, \`name\`, \`type\`, \`menu_id\`) VALUES (16, 'PsnProfileOperation', '概览操作', '0', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu_permission\` (\`role_id\`, \`menu_id\`, \`permission_id\`) VALUES (1, 3, 16);`,
    );
    /** 新增游戏概览菜单 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (13, 'PlayStation_Profile_Game', '游戏概览', 2);`,
    );
    /** 给予管理员游戏概览菜单访问权限 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 13);`,
    );
    /** 新增梦幻西游菜单 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (14, 'Mhxy', '梦幻西游', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (15, 'Mhxy_Account', '账号一览', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (16, 'Mhxy_Gold_Record', '金币收支记录', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (17, 'Mhxy_Gold_Transfer', '转金', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (18, 'Mhxy_Prop_Category', '道具种类', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (19, 'Mhxy_Channel', '途径管理', 14);`,
    );
    /** 配置 admin 权限 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 15);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 16);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 17);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 18);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 19);`,
    );

    /** 添加配置 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`system_setting\` (\`id\`, \`key\`, \`value\`, \`description\`) VALUES (4, 'MHXY_TRADE_TAX', '9', '梦幻西游交易税率(%)');`,
    );

    /** 新增途径数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('DAILY', '日常', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('GOLD_TRANSFER', '转金', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('TRADE', '交易', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('ACTIVITY', '活动', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` ( \`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('SYSTEM', '系统', 1, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('GOLD_LOCK', '金币被锁', 1, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('GOLD_UNLOCK', '金币解锁', 1, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('GOLD_DEDUCT', '金币被扣除', 1, 5);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_channel\` (\`key\`, \`name\`, \`is_default\`, \`parent_id\`) VALUES ('MANUAL_CALIBRATION', '人工校正', 1, 5);`,
    );
    /** 添加定时任务菜单 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (20, 'Schedule_Task', '定时任务', 11);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 20);`,
    );
    /** 添加定时任务 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`schedule_task\` (\`key\`, \`name\`, \`description\`, \`cycle\`, \`status\`, \`last_run_time\`) VALUES ('MHXY_ACCOUNT_GOLD_DAILY', '梦幻西游账号金币统计', '按天为单位统计每个账号当前的金币数', '0 55 23 * * *', 'close', NULL);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`schedule_task\` (\`key\`, \`name\`, \`description\`, \`cycle\`, \`status\`, \`last_run_time\`) VALUES ('MHXY_GOLD_TRANSFER_TODO_NOTIFY', '梦幻西游转金待办通知', '根据配置的转金策略生成待办通知', '5 0 0 * * *', 'close', NULL);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`schedule_task\` (\`key\`, \`name\`, \`description\`, \`cycle\`, \`status\`, \`last_run_time\`) VALUES ('NOTICE_EXPIRE_CHECK', '通知过期检查', '检查通知是否过期', '5 0 0 * * *', 'close', NULL);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`schedule_task\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`mhxy_channel\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`system_setting\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`role_menu_permission\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`permission\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`role_menu\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`user_role\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`role\``);
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`user\``);
  }
}

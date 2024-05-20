import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1021706518443340 implements MigrationInterface {
  name = 'CreateV1021706518443340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 创建权限表 */
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NOT NULL COMMENT '权限标识', \`name\` varchar(16) NOT NULL COMMENT '权限名称', \`type\` enum ('1', '2', '3', '4', '0') NOT NULL COMMENT '权限类型' DEFAULT '0', \`menu_id\` int NULL, UNIQUE INDEX \`IDX_20ff45fefbd3a7c04d2572c3bb\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建菜单表 */
    await queryRunner.query(
      `CREATE TABLE \`menu\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NOT NULL, \`name\` varchar(16) NOT NULL COMMENT '菜单名称', \`parent_id\` int NOT NULL COMMENT '父菜单 id' DEFAULT '0', UNIQUE INDEX \`IDX_947bcf4f014dbed7655bee5ee5\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建角色表 */
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '角色名', \`is_default\` enum ('1', '0') NOT NULL COMMENT '是否内置角色' DEFAULT '0', UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建用户表 */
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(36) NOT NULL, \`username\` varchar(16) NOT NULL COMMENT '用户名', \`avatar\` varchar(128) NULL COMMENT '头像地址', \`password\` varchar(128) NOT NULL COMMENT '密码', \`nickname\` varchar(10) NOT NULL COMMENT '昵称', UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建用户-菜单-权限表 */
    await queryRunner.query(
      `CREATE TABLE \`role_menu_permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role_id\` int NULL, \`menu_id\` int NULL, \`permission_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    /** 创建菜单-权限表 */
    await queryRunner.query(
      `CREATE TABLE \`role_menu\` (\`roleId\` int NOT NULL, \`menuId\` int NOT NULL, INDEX \`IDX_4a57845f090fb832eeac3e3486\` (\`roleId\`), INDEX \`IDX_ed7dbf72cc845b0c9150a67851\` (\`menuId\`), PRIMARY KEY (\`roleId\`, \`menuId\`)) ENGINE=InnoDB`,
    );
    /** 创建用户-菜单表 */
    await queryRunner.query(
      `CREATE TABLE \`user_role\` (\`roleId\` int NOT NULL, \`userId\` varchar(36) NOT NULL, INDEX \`IDX_dba55ed826ef26b5b22bd39409\` (\`roleId\`), INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` (\`userId\`), PRIMARY KEY (\`roleId\`, \`userId\`)) ENGINE=InnoDB`,
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
      `ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_4a57845f090fb832eeac3e34860\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_ed7dbf72cc845b0c9150a678512\` FOREIGN KEY (\`menuId\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_ed7dbf72cc845b0c9150a678512\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_4a57845f090fb832eeac3e34860\``,
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
    await queryRunner.query(`DROP INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` ON \`user_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_dba55ed826ef26b5b22bd39409\` ON \`user_role\``);
    await queryRunner.query(`DROP TABLE \`user_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_ed7dbf72cc845b0c9150a67851\` ON \`role_menu\``);
    await queryRunner.query(`DROP INDEX \`IDX_4a57845f090fb832eeac3e3486\` ON \`role_menu\``);
    await queryRunner.query(`DROP TABLE \`role_menu\``);
    await queryRunner.query(`DROP TABLE \`role_menu_permission\``);
    await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP INDEX \`IDX_947bcf4f014dbed7655bee5ee5\` ON \`menu\``);
    await queryRunner.query(`DROP TABLE \`menu\``);
    await queryRunner.query(`DROP INDEX \`IDX_20ff45fefbd3a7c04d2572c3bb\` ON \`permission\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
  }
}

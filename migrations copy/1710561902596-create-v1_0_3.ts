import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateV1031710561902596 implements MigrationInterface {
    name = 'CreateV1031710561902596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mhxy_account\` (\`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`name\` varchar(16) NOT NULL COMMENT '账号名称', \`is_primary\` tinyint NOT NULL COMMENT '是否是主号' DEFAULT 0, \`role\` varchar(255) NOT NULL COMMENT '角色', \`sect\` varchar(255) NOT NULL COMMENT '门派', \`gold\` int NOT NULL COMMENT '金币数量' DEFAULT '0', \`lock_gold\` int NOT NULL COMMENT '被锁金币数量' DEFAULT '0', \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mhxy_prop_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(16) NOT NULL COMMENT '名称', \`isGem\` tinyint NOT NULL COMMENT '是否为珍品' DEFAULT 0, \`parentId\` int NOT NULL COMMENT '父级 id' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mhxy_channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(32) NULL COMMENT '途径 key，唯一，用于业务判断', \`name\` varchar(16) NOT NULL COMMENT '名称', \`is_default\` tinyint NOT NULL COMMENT '是否默认' DEFAULT 0, \`parent_id\` int NOT NULL COMMENT '父级 id' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mhxy_account_gold_transfer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`expenditure_amount\` int NOT NULL COMMENT '支出金额' DEFAULT '0', \`revenue_amount\` int NOT NULL COMMENT '收入金额' DEFAULT '0', \`status\` enum ('progress', 'success', 'fail_from_lock') NOT NULL COMMENT '状态' DEFAULT 'progress', \`create_time\` timestamp NOT NULL COMMENT '转金时间' DEFAULT CURRENT_TIMESTAMP, \`from_account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`to_account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`prop_category_id\` int NOT NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mhxy_account_gold_record\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` int NOT NULL COMMENT '数额' DEFAULT '0', \`type\` enum ('expenditure', 'revenue') NOT NULL COMMENT '收支类型: expenditure-支出,revenue-收入' DEFAULT 'revenue', \`status\` int NOT NULL COMMENT '状态: 0-进行中,1-已完成' DEFAULT '1', \`remark\` varchar(256) NOT NULL COMMENT '备注' DEFAULT '', \`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`channel_id\` int NOT NULL, \`prop_category_id\` int NULL, \`account_id\` varchar(10) NOT NULL COMMENT '账号 Id （官方）', \`user_id\` varchar(36) NOT NULL, \`transfer_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`key\` \`key\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`psn_trophy_group\` CHANGE \`name\` \`name\` varchar(255) NOT NULL COMMENT '名称'`);
        await queryRunner.query(`ALTER TABLE \`psn_profile\` CHANGE \`psn_id\` \`psn_id\` varchar(255) NOT NULL COMMENT 'Psn Id'`);
        await queryRunner.query(`ALTER TABLE \`psn_profile\` CHANGE \`avatar\` \`avatar\` varchar(255) NOT NULL COMMENT '头像地址'`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account\` ADD CONSTRAINT \`FK_442b554c3276c9de7fb9027dfdc\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_2db0cd7c503f7ea4ddc8757b309\` FOREIGN KEY (\`from_account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_f5f629d153c8af1cad4c9ef9cb9\` FOREIGN KEY (\`to_account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_c6a5aaa8b384c27681760ad93a1\` FOREIGN KEY (\`prop_category_id\`) REFERENCES \`mhxy_prop_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` ADD CONSTRAINT \`FK_ea41098e06586a02cb6dbbf90dd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_e4614aebda1aa83a773726cb279\` FOREIGN KEY (\`channel_id\`) REFERENCES \`mhxy_channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_305892470ab45eb2d45ce6e8c20\` FOREIGN KEY (\`prop_category_id\`) REFERENCES \`mhxy_prop_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_94be1b29ff282df31b76b0eeaa6\` FOREIGN KEY (\`account_id\`) REFERENCES \`mhxy_account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_230638822b841d9f583c3ae188e\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` ADD CONSTRAINT \`FK_1f81e8bcab12fb276d778c739be\` FOREIGN KEY (\`transfer_id\`) REFERENCES \`mhxy_account_gold_transfer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_1f81e8bcab12fb276d778c739be\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_230638822b841d9f583c3ae188e\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_94be1b29ff282df31b76b0eeaa6\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_305892470ab45eb2d45ce6e8c20\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_record\` DROP FOREIGN KEY \`FK_e4614aebda1aa83a773726cb279\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_ea41098e06586a02cb6dbbf90dd\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_c6a5aaa8b384c27681760ad93a1\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_f5f629d153c8af1cad4c9ef9cb9\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account_gold_transfer\` DROP FOREIGN KEY \`FK_2db0cd7c503f7ea4ddc8757b309\``);
        await queryRunner.query(`ALTER TABLE \`mhxy_account\` DROP FOREIGN KEY \`FK_442b554c3276c9de7fb9027dfdc\``);
        await queryRunner.query(`ALTER TABLE \`psn_profile\` CHANGE \`avatar\` \`avatar\` varchar(255) NOT NULL COMMENT '头像地址'`);
        await queryRunner.query(`ALTER TABLE \`psn_profile\` CHANGE \`psn_id\` \`psn_id\` varchar(255) NOT NULL COMMENT 'Psn Id'`);
        await queryRunner.query(`ALTER TABLE \`psn_trophy_group\` CHANGE \`name\` \`name\` varchar(255) NOT NULL COMMENT '名称'`);
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`key\` \`key\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`mhxy_account_gold_record\``);
        await queryRunner.query(`DROP TABLE \`mhxy_account_gold_transfer\``);
        await queryRunner.query(`DROP TABLE \`mhxy_channel\``);
        await queryRunner.query(`DROP TABLE \`mhxy_prop_category\``);
        await queryRunner.query(`DROP TABLE \`mhxy_account\``);
    }

}

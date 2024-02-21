import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertV1031708482447922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 插入梦幻角色数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (1, '剑侠客', 'https://cbg-my.res.netease.com/game_res/res/photo/0001.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (2, '巫蛮儿', 'https://cbg-my.res.netease.com/game_res/res/photo/0002.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (3, '龙太子', 'https://cbg-my.res.netease.com/game_res/res/photo/0003.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (4, '玄彩娥', 'https://cbg-my.res.netease.com/game_res/res/photo/0004.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (5, '杀破狼', 'https://cbg-my.res.netease.com/game_res/res/photo/0005.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (6, '骨精灵', 'https://cbg-my.res.netease.com/game_res/res/photo/0006.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (7, '逍遥生', 'https://cbg-my.res.netease.com/game_res/res/photo/0007.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (8, '舞天姬', 'https://cbg-my.res.netease.com/game_res/res/photo/0008.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (9, '虎头怪', 'https://cbg-my.res.netease.com/game_res/res/photo/0009.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (10, '飞燕女', 'https://cbg-my.res.netease.com/game_res/res/photo/0010.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (11, '神天兵', 'https://cbg-my.res.netease.com/game_res/res/photo/0011.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (12, '狐美人', 'https://cbg-my.res.netease.com/game_res/res/photo/0012.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (13, '漠少君', 'https://cbg-my.res.netease.com/game_res/res/photo/0013.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (14, '巨魔王', 'https://cbg-my.res.netease.com/game_res/res/photo/0014.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (15, '英女侠', 'https://cbg-my.res.netease.com/game_res/res/photo/0015.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (16, '羽灵神', 'https://cbg-my.res.netease.com/game_res/res/photo/0016.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (17, '梦灵珑（仙）', 'https://cbg-my.res.netease.com/game_res/res/photo/0017.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (18, '梦灵珑（魔）', 'https://cbg-my.res.netease.com/game_res/res/photo/0018.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (19, '喵千岁', 'https://cbg-my.res.netease.com/game_res/res/photo/0019.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_role\` (\`id\`, \`name\`, \`avatar\`) VALUES (20, '越星河', 'https://cbg-my.res.netease.com/game_res/res/photo/0020.png');`,
    );
    /** 插入梦幻门派数据 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (1, '大唐官府', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab02_cf5fc65.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (2, '方寸山', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab03_0c10f48.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (3, '狮驼岭', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab04_27c483c.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (4, '普陀山', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab05_ef6abd5.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (5, '阴曹地府', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab06_36fc680.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (6, '龙宫', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab07_d49a2e4.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (7, '魔王寨', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab08_1a010fd.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (8, '化生寺', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab09_8addb2d.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (9, '月宫', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab10_e66b91f.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (10, '女儿村', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab11_ce7145f.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (11, '小雷音', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab12_0cec5ea.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (12, '花果山', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab13_e853615.png');`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`mhxy_account_sect\` (\`id\`, \`name\`, \`thumbnail\`) VALUES (13, '须弥海', 'https://my.res.netease.com/pc/zt/20160524163805/img/tab14_c5cfb81.png');`,
    );
    /** 新增梦幻西游菜单 */
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (14, 'Mhxy', '梦幻西游', 0);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`menu\` (\`id\`, \`key\`, \`name\`, \`parent_id\`) VALUES (15, 'Mhxy_Account', '账号一览', 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 14);`,
    );
    await queryRunner.query(
      `INSERT INTO \`gypsophila\`.\`role_menu\` (\`roleId\`, \`menuId\`) VALUES (1, 15);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`gypsophila\`.\`menu\` WHERE \`id\` IN (14,15)`);
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`role_menu\` WHERE (\`roleId\` = 1 AND\`menuId\`= 14) OR (\`roleId\` = 1 AND \`menuId\` = 15)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`mhxy_account_sect\` WHERE \`id\` IN (1,2,3,4,5,6,7,8,9,10,11,12,13)`,
    );
    await queryRunner.query(
      `DELETE FROM \`gypsophila\`.\`mhxy_account_role\` WHERE \`id\` IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20)`,
    );
  }
}

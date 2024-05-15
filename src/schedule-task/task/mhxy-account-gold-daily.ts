import { LoggerService } from '@nestjs/common';
import { ENUM_TASK } from '../constants';
import { Task } from '../typings';
import { QueryRunner } from 'typeorm';
import { MhxyAccount, MhxyAccountGoldDaily } from 'src/entities';
import { ENUM_MHXY_ACCOUNT_STATUS } from 'src/constants';
import { startOfNowDate } from 'src/utils';

export const MHXY_ACCOUNT_GOLD_DAILY: Task = {
  key: ENUM_TASK.MHXY_ACCOUNT_GOLD_DAILY,
  execute: async (logger: LoggerService, queryRunner: QueryRunner) => {
    const manager = queryRunner.manager;
    // 查找活跃中的账号
    const accounts = await manager.find(MhxyAccount, {
      where: { status: ENUM_MHXY_ACCOUNT_STATUS.ACTIVE },
    });
    // 如果已存在当日的统计数据，则删除
    let dailies = await manager.find(MhxyAccountGoldDaily, {
      where: { date: startOfNowDate() },
    });
    if (dailies.length) {
      await manager.remove(dailies);
    }
    // 获得账号金币数，并保存
    dailies = accounts.map((account) => {
      return manager.create(MhxyAccountGoldDaily, {
        account,
        date: new Date(),
        amount: account.gold,
      });
    });
    await manager.save(dailies);
    const msg = `执行成功，已删除 ${dailies.length} 条数据，已统计 ${accounts.length} 条数据。`;
    return msg;
  },
};

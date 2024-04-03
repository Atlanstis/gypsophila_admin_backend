import { LoggerService } from '@nestjs/common';
import { ENUM_TASK } from '../constants';
import { Task } from '../typings';
import { QueryRunner } from 'typeorm';
import { MhxyAccount, MhxyAccountGoldDaily } from 'src/entities';
import { ENUM_MHXY_ACCOUNT_STATUS } from 'src/constants';
import * as dayjs from 'dayjs';

export const MHXY_ACCOUNT_GOLD_DAILY: Task = {
  key: ENUM_TASK.MHXY_ACCOUNT_GOLD_DAILY,
  execute: async (logger: LoggerService, queryRunner: QueryRunner) => {
    const manager = queryRunner.manager;
    const accounts = await manager.find(MhxyAccount, {
      where: { status: ENUM_MHXY_ACCOUNT_STATUS.ACTIVE },
    });
    let dailies = await manager.find(MhxyAccountGoldDaily, {
      where: { date: dayjs(dayjs().format('YYYY-MM-DD')).toDate() },
    });
    if (dailies.length) {
      await manager.remove(dailies);
    }
    dailies = accounts.map((account) => {
      return manager.create(MhxyAccountGoldDaily, {
        account,
        date: new Date(),
        amount: account.gold,
      });
    });
    await manager.save(dailies);
    const msg = `执行成功，已删除 ${dailies.length} 条数据，已统计 ${accounts.length} 条数据`;
    logger.log(msg);
    return msg;
  },
};

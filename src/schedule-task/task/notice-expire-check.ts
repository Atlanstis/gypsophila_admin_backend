import { LoggerService } from '@nestjs/common';
import { ENUM_TASK } from '../constants';
import { Task } from '../typings';
import { In, LessThan, QueryRunner } from 'typeorm';
import { Notice } from 'src/entities';
import { nowDate } from 'src/utils';
import { EnumNoticeStatus } from 'src/constants';

export const NOTICE_EXPIRE_CHECK: Task = {
  key: ENUM_TASK.NOTICE_EXPIRE_CHECK,
  execute: async (logger: LoggerService, queryRunner: QueryRunner) => {
    const manager = queryRunner.manager;

    // 查询已过期的通知
    const notices = await manager.find(Notice, {
      where: {
        expireTime: LessThan(nowDate()),
      },
    });

    // 更新通知状态为过期
    await manager.update(
      Notice,
      {
        id: In(notices.map((notice) => notice.id)),
      },
      {
        status: EnumNoticeStatus.Expire,
      },
    );

    const msg = `执行成功，已将 ${notices.length} 条通知的状态设置为失效。`;
    return msg;
  },
};

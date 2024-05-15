import { LoggerService } from '@nestjs/common';
import { ENUM_TASK } from '../constants';
import { Task } from '../typings';
import { Between, In, QueryRunner } from 'typeorm';
import { MhxyAccount, MhxyGoldTransferPolicyApply, Notice, User } from 'src/entities';
import {
  ENUM_MHXY_ACCOUNT_STATUS,
  ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS,
  NoticeCategoryEnum,
  NoticeStatusEnum,
  NoticeTypeEnum,
} from 'src/constants';
import { endOfNowDate, startOfNowDate } from 'src/utils';

export const MHXY_GOLD_TRANSFER_TODO_NOTIFY: Task = {
  key: ENUM_TASK.MHXY_GOLD_TRANSFER_TODO_NOTIFY,
  execute: async (logger: LoggerService, queryRunner: QueryRunner) => {
    const manager = queryRunner.manager;

    // 删除已添加的待办，避免重复添加
    await manager.delete(Notice, {
      category: NoticeCategoryEnum.MhxyTransfer,
      type: NoticeTypeEnum.Todo,
      createTime: Between(startOfNowDate(), endOfNowDate()),
    });

    // 获取需当天执行的应用策略
    const applies = await manager.find(MhxyGoldTransferPolicyApply, {
      where: {
        status: ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.OPEN,
        nextExecuteTime: startOfNowDate(),
      },
      relations: {
        account: true,
        policy: {
          propCategory: true,
        },
        user: true,
      },
    });

    // 根据用户 id 获取所有生效的非主账号
    const userAccountMap: Record<User['id'], MhxyAccount[]> = {};
    const accounts = await manager.find(MhxyAccount, {
      relations: {
        user: true,
      },
      where: {
        status: ENUM_MHXY_ACCOUNT_STATUS.ACTIVE,
        isPrimary: false,
        user: {
          id: In(applies.map((apply) => apply.user.id)),
        },
      },
    });
    accounts.forEach((account) => {
      if (userAccountMap[account.user.id]) {
        userAccountMap[account.user.id].push(account);
      } else {
        userAccountMap[account.user.id] = [account];
      }
    });
    // 按金币数正序排列
    Object.keys(userAccountMap).forEach((id) => {
      userAccountMap[id] = userAccountMap[id].sort((a, b) => a.gold - b.gold);
    });

    // 生成待办
    const notices = applies.map((apply) => {
      // 查找满足条件的转出账户
      const accounts = userAccountMap[apply.user.id];
      const targetQuota = apply.policy.quota + 10000;
      const fromAccount = accounts.find(
        (account) => account.gold >= targetQuota && account.id !== apply.account.id,
      );
      if (fromAccount) {
        fromAccount.gold -= targetQuota;
      }
      return manager.create(Notice, {
        title: 'MHXY 转金',
        link: {
          account: apply.account,
          propCategory: apply.policy.propCategory,
          fromAccountId: fromAccount ? fromAccount.id : null,
        },
        type: NoticeTypeEnum.Todo,
        category: NoticeCategoryEnum.MhxyTransfer,
        status: NoticeStatusEnum.Active,
        expireTime: endOfNowDate(),
        user: apply.user,
      });
    });
    await manager.save(notices);

    const count = notices.length;
    const msg = `执行成功，已删除 ${count} 条待办，已为 ${count} 条转金策略添加待办。`;
    return msg;
  },
};

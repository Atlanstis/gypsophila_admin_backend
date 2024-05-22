import { MhxyAccount, MhxyPropCategory } from 'src/entities';

type NoticeKey = 'TitleMax' | 'DescriptionMax' | 'CategoryMax';

/** 权限各键值长度枚举 */
export const NoticeLength: Record<NoticeKey, number> = {
  /** 标题最大长度 */
  TitleMax: 32,
  /** 描述最大长度 */
  DescriptionMax: 256,
  /** 类别 */
  CategoryMax: 32,
};

export enum EnumNoticeCategory {
  /** Mhxy 转金 */
  MhxyTransfer = 'MhxyTransfer',
}

/** 通知类型 */
export enum EnumNoticeType {
  /** 待办 */
  Todo = 'Todo',
  /** 消息 */
  Message = 'Message',
}

/** 通知状态 */
export enum EnumNoticeStatus {
  /** 生效中 */
  Active = 'Active',
  /** 已处理 */
  Handled = 'Handled',
  /** 已过期 */
  Expire = 'Expire',
}

/** Mhxy 转金关联信息 */
export interface NoticeMhxyTransferLink {
  account: MhxyAccount;
  propCategory: MhxyPropCategory;
  fromAccountId?: MhxyAccount['id'];
}

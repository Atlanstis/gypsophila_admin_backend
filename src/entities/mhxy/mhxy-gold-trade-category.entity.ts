import { MHXY_GOLD_TRADE_CATEGORY_LENGTH } from '../../constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mhxy_gold_trade_category' })
/** 梦幻金币贸易种类表 */
export class MhxyGoldTradeCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '名称', length: MHXY_GOLD_TRADE_CATEGORY_LENGTH.NAME_MAX })
  name: string;

  @Column({ comment: '是否内置', name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ comment: '状态:1生效,0失效', type: 'enum', enum: ['0', '1'], default: '1' })
  status: '1' | '0';

  @Column({ comment: '是否是转金项', name: 'is_transfer', default: false })
  isTransfer: boolean;

  @Column({ comment: '是否是珍品', name: 'is_gem', default: false })
  isGem: boolean;

  @Column({ comment: '转金额度', name: 'transter_quota', nullable: true })
  transterQuota: number;

  @Column({ comment: '转金周期(天)', name: 'transfer_cycle', nullable: true })
  transferCycle: number;
}

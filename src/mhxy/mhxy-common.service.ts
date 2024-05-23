import { Injectable } from '@nestjs/common';
import { MHXY_TRADE_TAX } from 'src/constants';
import { SettingService } from 'src/setting/setting.service';
import BigNumber from 'bignumber.js';

@Injectable()
/** 梦幻没有特定种类接口 */
export class MhxyCommonService {
  constructor(private readonly settingService: SettingService) {}

  /** 计算除去交易税后的价格 */
  async amountCalc(amount: number) {
    const tax = await this.settingService.getSettingByKey(MHXY_TRADE_TAX, [
      [(tax) => !tax, '请先设置 MHXY_TRADE_TAX'],
      [(tax) => isNaN(Number(tax.value)), 'MHXY_TRADE_TAX 设置错误'],
    ]);
    return Number(new BigNumber(amount * (100 - Number(tax.value)) * 0.01).toFixed(0));
  }
}

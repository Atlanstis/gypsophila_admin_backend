import { Injectable } from '@nestjs/common';
import { publicKey } from 'src/utils';
import { SettingService } from './modules/setting/setting.service';
import {
  SettingKey_WebsiteName,
  SettingKey_WebsiteRecordNumber,
  SettingKey_WebsiteShowRecordNumber,
} from 'src/constants';

@Injectable()
export class SystemService {
  constructor(private readonly settingService: SettingService) {}

  async getInfo(): Promise<ResSystem.Info> {
    const res: Omit<ResSystem.Info, 'publicKey'> =
      await this.settingService.getSettingByKey([
        SettingKey_WebsiteName,
        SettingKey_WebsiteRecordNumber,
        SettingKey_WebsiteShowRecordNumber,
      ]);
    return {
      ...res,
      publicKey,
    };
  }
}

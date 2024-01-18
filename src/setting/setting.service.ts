import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WEBSITE_NAME, WEBSITE_RECORD_NUMBER, WEBSITE_SHOW_RECORD_NUMBER } from 'src/constants';
import { SystemSetting } from 'src/entities';
import { In, Repository } from 'typeorm';
import { WebsiteDto } from './dto';

/** 网站设置-字段对应 */
const transferMap = {
  [WEBSITE_NAME]: 'name',
  [WEBSITE_RECORD_NUMBER]: 'recordNumber',
  [WEBSITE_SHOW_RECORD_NUMBER]: 'showRecordNumber',
};

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingRepository: Repository<SystemSetting>,
  ) {}

  /** 获取网站配置 */
  async getWebsiteInfo() {
    const list = await this.settingRepository.find({
      select: { key: true, value: true },
      where: { key: In([WEBSITE_NAME, WEBSITE_RECORD_NUMBER, WEBSITE_SHOW_RECORD_NUMBER]) },
    });
    const info: Record<string, string | boolean> = {};
    list.forEach(({ key, value }) => {
      if (key === WEBSITE_SHOW_RECORD_NUMBER) {
        info[transferMap[key]] = value === 'true';
      } else {
        info[transferMap[key]] = value;
      }
    });
    return info;
  }

  /** 更新网站配置 */
  async updateWebsiteInfo(dto: WebsiteDto) {
    const list = await this.settingRepository.find({
      where: { key: In([WEBSITE_NAME, WEBSITE_RECORD_NUMBER, WEBSITE_SHOW_RECORD_NUMBER]) },
    });
    list.forEach((item) => {
      item.value =
        item.key === WEBSITE_SHOW_RECORD_NUMBER
          ? `${dto[transferMap[item.key]]}`
          : dto[transferMap[item.key]];
    });
    await this.settingRepository.save(list);
  }
}

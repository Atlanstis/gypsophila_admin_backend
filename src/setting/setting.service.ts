import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WEBSITE_NAME, WEBSITE_RECORD_NUMBER, WEBSITE_SHOW_RECORD_NUMBER } from 'src/constants';
import { SystemSetting } from 'src/entities';
import { In, Repository } from 'typeorm';
import { WebsiteDto } from './dto';
import { RoleService } from 'src/role/role.service';
import { BusinessException } from 'src/core';

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
    private readonly roleService: RoleService,
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

  async getSettingCommonTabs(roleIds: number[]) {
    const rmps = await this.roleService.getPermissionByRoleIds(roleIds);
    return rmps.filter((rmp) => rmp.menu.key === 'Setting_Common').map((rmp) => rmp.permission.key);
  }

  /**
   * 根据 key 获取配置
   * @param key key
   * @Param actions 判断条件
   */
  async getSettingByKey(key: string, actions: [(setting: SystemSetting) => boolean, string][]) {
    const setting = await this.settingRepository.findOne({
      where: {
        key,
      },
    });
    actions.some((item) => {
      const [flag, str] = item;
      if (flag(setting)) {
        throw new BusinessException(str);
      }
      return flag;
    });
    return setting;
  }
}

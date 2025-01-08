import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EnumMenuKey,
  SettingKey_WebsiteName,
  SettingKey_WebsiteRecordNumber,
  SettingKey_WebsiteShowRecordNumber,
} from 'src/constants';
import { SystemSetting } from 'src/entities';
import { In, Repository } from 'typeorm';
import { WebsiteDto } from './dto';
import { RoleService } from 'src/modules/management/role/role.service';
import { MenuPermissionService } from 'src/modules/management/menu/menu-permission.service';
import { Enum_SettingType } from '../../constants';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingRepository: Repository<SystemSetting>,
    private readonly roleService: RoleService,
    private readonly mpService: MenuPermissionService,
  ) {}

  /** 更新网站配置 */
  async updateWebsiteInfo(dto: WebsiteDto) {
    const arrs = [
      { key: SettingKey_WebsiteName, value: dto.websiteName },
      { key: SettingKey_WebsiteRecordNumber, value: dto.websiteRecordNumber },
      {
        key: SettingKey_WebsiteShowRecordNumber,
        value: dto.webisteShowRecordNumber,
      },
    ];
    await this.setSettingByKey(arrs);
  }

  async getSettingCommonTabs(
    roleIds: number[],
  ): Promise<ResSetting.CommonTab[]> {
    // 获取当前菜单下的所有权限
    const allPermissions = await this.mpService.getPermissionList({
      key: EnumMenuKey.Setting_Common,
    });
    // 获取当前角色拥有的权限
    const rolePermissionSet =
      await this.roleService.getRolePermissionsFromRedis(roleIds);
    const permissions = allPermissions.filter((item) =>
      rolePermissionSet.has(item.key),
    );
    // 返回已授权下的 tab
    return permissions.map((item) => ({
      name: item.name,
      key: item.key,
    }));
  }

  async setSettingByKey(arrs: { key: string; value: any }[]) {
    const keys = arrs.map((item) => item.key);
    const settings = await this.settingRepository.find({
      where: { key: In(keys) },
    });

    const typeHandlers = {
      [Enum_SettingType.boolean]: (value: any) => (value ? 'true' : 'false'),
      [Enum_SettingType.number]: (value: any) => value.toString(),
      [Enum_SettingType.string]: (value: any) => value,
    };

    settings.forEach((setting) => {
      const item = arrs.find((item) => item.key === setting.key);
      if (item) {
        const handler =
          typeHandlers[setting.type] || typeHandlers[Enum_SettingType.string];
        setting.value = handler(item.value);
      }
    });

    await this.settingRepository.save(settings);
  }

  /**
   * 根据 key 获取系统配置
   * @param key key
   */
  async getSettingByKey<T>(keys: string[]): Promise<T> {
    const settings = await this.settingRepository.find({
      where: { key: In(keys) },
    });
    const typeHandlers = {
      [Enum_SettingType.boolean]: (value: string | null) => value === 'true',
      [Enum_SettingType.number]: (value: string | null) =>
        Number.isNaN(Number(value)) ? 0 : Number(value),
      [Enum_SettingType.string]: (value: string | null) => value ?? '',
    };
    const res = settings.reduce(
      (acc, item) => {
        const handler = typeHandlers[item.type];
        if (handler) {
          acc[item.alias] = handler(item.value);
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return res as T;
  }
}

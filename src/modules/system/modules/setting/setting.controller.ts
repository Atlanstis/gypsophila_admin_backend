import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { WebsiteDto } from './dto';
import {
  JwtGuard,
  PermissionGuard,
  RawData,
  RequirePermission,
  ResponseData,
} from 'src/core';
import { Request } from 'express';
import { EnumMenuKey } from 'src/constants';
import { WebsiteSetting } from './constants';

@Controller('setting')
@UseGuards(JwtGuard)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  /** 更新网站配置 */
  @Post('website/update')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(WebsiteSetting)
  async updateWebsiteInfo(@Body() dto: WebsiteDto) {
    await this.settingService.updateWebsiteInfo(dto);
    return ResponseData.success(null, '更新成功');
  }

  /** 通用配置-可访问的配置项 */
  @Get('common/tabs')
  @RequirePermission(EnumMenuKey.Setting_Common, 'menu')
  async getSettingCommonTabs(@Req() req: Request) {
    return await this.settingService.getSettingCommonTabs(req.user.roleIds);
  }
}

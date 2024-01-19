import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { WebsiteDto } from './dto';
import { JwtGuard, PermissionGuard, RequirePermission } from 'src/core';
import { Request } from 'express';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  /** 获取网站配置 */
  @Get('website/info')
  async getWebsiteInfo() {
    return await this.settingService.getWebsiteInfo();
  }

  /** 更新网站配置 */
  @Post('website/update')
  @UseGuards(JwtGuard, PermissionGuard)
  @RequirePermission('WebsiteSetting')
  async updateWebsiteInfo(@Body() dto: WebsiteDto) {
    return await this.settingService.updateWebsiteInfo(dto);
  }

  /** 通用配置-可访问的配置项 */
  @Get('common/tabs')
  @UseGuards(JwtGuard)
  async getSettingCommonTabs(@Req() req: Request) {
    return await this.settingService.getSettingCommonTabs(req.user.roleIds);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingService } from './setting.service';
import { WebsiteDto } from './dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('website/info')
  getWebsiteInfo() {
    return this.settingService.getWebsiteInfo();
  }

  @Post('website/update')
  updateWebsiteInfo(@Body() dto: WebsiteDto) {
    return this.settingService.updateWebsiteInfo(dto);
  }
}

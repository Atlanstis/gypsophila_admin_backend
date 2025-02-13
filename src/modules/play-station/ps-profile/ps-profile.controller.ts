import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  CommonPageDto,
  JwtGuard,
  PermissionGuard,
  RawData,
  RequirePermission,
  ResponseData,
} from 'src/core';
import { EnumMenuKey } from 'src/constants';
import { PsProfileService } from './ps-profile.service';
import { ProfileGameIdDto, PageDto, PsnIdDto, PsnineGameIdDto } from './dto';

@Controller('ps/profile')
@UseGuards(JwtGuard)
export class PsProfileController {
  constructor(private readonly psProfileService: PsProfileService) {}

  /** 用户信息 */
  @Get('info')
  @RequirePermission(EnumMenuKey.PlayStation_Profile, 'menu')
  @UseGuards(PermissionGuard)
  async getProfileInfo(@Req() req: Request) {
    return await this.psProfileService.getProfileInfo(req.user);
  }

  /** 用户信息-绑定 */
  @Post('bind')
  @RawData()
  @UseGuards(PermissionGuard)
  @RequirePermission(EnumMenuKey.PlayStation_Profile, 'menu')
  async profileBind(@Body() dto: PsnIdDto, @Req() req: Request) {
    await this.psProfileService.profileBind(dto.psnId, req.user);
    return ResponseData.success(null, '绑定成功');
  }

  /** 用户-游戏信息 */
  @Post('game/info')
  @RequirePermission(EnumMenuKey.PlayStation_Profile, 'menu')
  @UseGuards(PermissionGuard)
  async getProfileGameInfo(@Body() dto: ProfileGameIdDto, @Req() req: Request) {
    return await this.psProfileService.getProfileGameInfo(
      dto.profileGameId,
      req.user,
    );
  }

  /** 用户-游戏列表 */
  @Post('game/list')
  @RequirePermission(EnumMenuKey.PlayStation_Profile, 'menu')
  @UseGuards(PermissionGuard)
  async getProfileGameList(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.psProfileService.getProfileGameList(
      dto.page,
      dto.size,
      req.user,
    );
  }

  /** 用户-psnine-游戏列表 */
  @Post('psnine/game/list')
  @RequirePermission(EnumMenuKey.PlayStation_Profile, 'menu')
  @UseGuards(PermissionGuard)
  async getProfilePsnineGameList(@Body() dto: PageDto, @Req() req: Request) {
    return await this.psProfileService.getProfilePsnineGameList(
      dto.page,
      req.user,
    );
  }

  /** 用户-psnine-游戏-同步 */
  @Post('psnine/game/sync')
  @RawData()
  @RequirePermission(EnumMenuKey.PlayStation_Profile, 'menu')
  @UseGuards(PermissionGuard)
  async psnineGameSync(@Body() dto: PsnineGameIdDto, @Req() req: Request) {
    await this.psProfileService.psnineGameSync(dto, req.user);
    return ResponseData.success(null, '同步成功');
  }
}

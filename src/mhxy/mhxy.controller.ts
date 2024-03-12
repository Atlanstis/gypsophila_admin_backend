import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommonPageDto, JwtGuard } from 'src/core';
import {
  ChannelAddDto,
  ChannelDeleteDto,
  ChannelEditDto,
  MhxyAccountDto,
  MhxyAccountEditDto,
  MhxyAccountIdDto,
  PropCategoryAddDto,
  PropCategoryDeleteDto,
  PropCategoryEditDto,
} from './dto';
import { MhxyAccountService } from './mhxy-account.service';
import { MhxyPropCategoryService } from './mhxy-prop-category.service';
import { MhxyChannelService } from './mhxy-channel.service';

@Controller('mhxy')
@UseGuards(JwtGuard)
export class MhxyController {
  constructor(
    private readonly accountService: MhxyAccountService,
    private readonly propCategoryService: MhxyPropCategoryService,
    private readonly channelService: MhxyChannelService,
  ) {}

  /** 获取梦幻账号数据 */
  @Post('/account/list')
  async accountList(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.accountService.accountList(dto, req.user.id);
  }

  /** 获取当前用户下所有梦幻账号数据 */
  @Post('/account/all')
  async accountAll(@Req() req: Request) {
    return await this.accountService.accountAll(req.user.id);
  }

  /** 新增账号数据 */
  @Post('/account/add')
  async accountAdd(@Body() dto: MhxyAccountDto, @Req() req: Request) {
    return await this.accountService.accountAdd(dto, req.user.id);
  }

  /** 编辑账号数据 */
  @Post('/account/edit')
  async accountEdit(@Body() dto: MhxyAccountEditDto, @Req() req: Request) {
    return await this.accountService.accountEdit(dto, req.user.id);
  }

  /** 删除账号数据 */
  @Post('/account/delete')
  async asscountDelete(@Body() dto: MhxyAccountIdDto, @Req() req: Request) {
    return await this.accountService.accountDelete(dto.id, req.user.id);
  }

  /** 获取角色数据 */
  @Get('/account/role')
  async accountRole() {
    return await this.accountService.accountRole();
  }

  /** 获取门派数据 */
  @Get('/account/sect')
  async accountSect() {
    return await this.accountService.accountSect();
  }

  /** 道具种类-新增 */
  @Post('/prop-category/add')
  async propCategoryAdd(@Body() dto: PropCategoryAddDto) {
    return await this.propCategoryService.propCategoryAdd(dto);
  }

  /** 道具种类-编辑 */
  @Post('/prop-category/edit')
  async propCategoryEdit(@Body() dto: PropCategoryEditDto) {
    return await this.propCategoryService.propCategoryEdit(dto);
  }

  /** 道具种类-删除 */
  @Post('/prop-category/delete')
  async propCategoryDelete(@Body() dto: PropCategoryDeleteDto) {
    return await this.propCategoryService.propCategoryDelete(dto);
  }

  /** 道具种类-列表 */
  @Post('/prop-category/list')
  async propCategoryList() {
    return await this.propCategoryService.propCategoryList();
  }

  /** 途径-列表 */
  @Post('/channel/list')
  async channelList() {
    return await this.channelService.channelList();
  }

  /** 途径-新增 */
  @Post('/channel/add')
  async channelAdd(@Body() dto: ChannelAddDto) {
    return await this.channelService.channelAdd(dto);
  }

  /** 途径-编辑 */
  @Post('/channel/edit')
  async channelEdit(@Body() dto: ChannelEditDto) {
    return await this.channelService.channelEdit(dto);
  }

  /** 途径-删除 */
  @Post('/channel/delete')
  async channelDelete(@Body() dto: ChannelDeleteDto) {
    return await this.channelService.channelDelete(dto);
  }
}

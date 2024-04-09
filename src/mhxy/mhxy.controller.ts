import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommonPageDto, JwtGuard } from 'src/core';
import {
  AccountGroupAddDto,
  AccountGroupEditDto,
  AccountGroupIdDto,
  AccountGroupListDto,
  ChannelAddDto,
  ChannelDeleteDto,
  ChannelEditDto,
  GoldRecordAddDto,
  GoldRecordCompleteDto,
  GoldRecordIdDto,
  GoldTransferDto,
  GoldTransferFinishDto,
  GoldTransferIdDto,
  GoldTransferPolicyAddDto,
  GoldTransferPolicyEditDto,
  GoldTransferPolicyIdDto,
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
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';
import { MhxyAccountGoldTransferService } from './mhxy-account-gold-transfer.service';
import { MhxyAccountGroupService } from './mhxy-account-group.service';
import { MhxyGoldTransferPolicyService } from './mhxy-gold-transfer-policy.service';

@Controller('mhxy')
@UseGuards(JwtGuard)
export class MhxyController {
  constructor(
    private readonly accountService: MhxyAccountService,
    private readonly propCategoryService: MhxyPropCategoryService,
    private readonly channelService: MhxyChannelService,
    private readonly goldRecordService: MhxyAccountGoldRecordService,
    private readonly goldTransferService: MhxyAccountGoldTransferService,
    private readonly groupService: MhxyAccountGroupService,
    private readonly goldTransferPolicyService: MhxyGoldTransferPolicyService,
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
    return await await this.channelService.channelDelete(dto);
  }

  /** 金币收支记录-分页 */
  @Post('account/gold-record/list')
  async goldRecordList(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.goldRecordService.goldRecordList(dto, req.user.id);
  }

  /** 金币收支记录-新增 */
  @Post('account/gold-record/add')
  async goldRecordAdd(@Body() dto: GoldRecordAddDto, @Req() req: Request) {
    return await this.goldRecordService.goldRecordAdd(dto, req.user.id);
  }

  /** 金币收支记录-分页 */
  @Post('account/gold-record/info')
  async goldRecordInfo(@Body() dto: GoldRecordIdDto, @Req() req: Request) {
    return await this.goldRecordService.goldRecordInfo(dto, req.user.id);
  }

  /** 金币收支记录-完成 */
  @Post('account/gold-record/complete')
  async goldRecordComplete(@Body() dto: GoldRecordCompleteDto, @Req() req: Request) {
    return await this.goldRecordService.goldRecordComplete(dto, req.user.id);
  }

  /** 金币收支记录-撤销 */
  @Post('account/gold-record/revert')
  async goldRecordRevert(@Body() dto: GoldRecordIdDto, @Req() req: Request) {
    return await this.goldRecordService.goldRecordRevert(dto, req.user.id);
  }

  /** 转金-分页 */
  @Post('account/gold-transfer/list')
  async goldTransferList(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.goldTransferService.goldTransferList(dto, req.user.id);
  }

  /** 转金-新增 */
  @Post('account/gold-transfer/add')
  async goldTransferAdd(@Body() dto: GoldTransferDto, @Req() req: Request) {
    return await this.goldTransferService.goldTransferAdd(dto, req.user.id);
  }

  /** 转金-单条信息 */
  @Post('account/gold-transfer/info')
  async goldTransferInfo(@Body() dto: GoldTransferIdDto, @Req() req: Request) {
    return await this.goldTransferService.goldTransferInfo(dto, req.user.id);
  }

  /** 转金-完成 */
  @Post('account/gold-transfer/finish')
  async goldTransferFinish(@Body() dto: GoldTransferFinishDto, @Req() req: Request) {
    return await this.goldTransferService.goldTransferFinish(dto, req.user.id);
  }

  /** 转金-撤销 */
  @Post('account/gold-transfer/revert')
  async goldTransferRevert(@Body() dto: GoldTransferIdDto, @Req() req: Request) {
    return await this.goldTransferService.goldTransferRevert(dto, req.user.id);
  }

  /** 账号分组-列表 */
  @Post('account/group/list')
  async accountGroupList(@Body() dto: AccountGroupListDto, @Req() req: Request) {
    return await this.groupService.accountGroupList(dto, req.user.id);
  }

  /** 账号分组-新增 */
  @Post('account/group/add')
  async accountGroupAdd(@Body() dto: AccountGroupAddDto, @Req() req: Request) {
    return await this.groupService.accountGroupAdd(dto, req.user.id);
  }

  /** 账号分组-编辑 */
  @Post('account/group/edit')
  async accountGroupEdit(@Body() dto: AccountGroupEditDto, @Req() req: Request) {
    return await this.groupService.accountGroupEdit(dto, req.user.id);
  }

  /** 账号分组-删除 */
  @Post('account/group/delete')
  async accountGroupDelete(@Body() dto: AccountGroupIdDto, @Req() req: Request) {
    return await this.groupService.accountGroupDelete(dto, req.user.id);
  }

  /** 转金策略-新增 */
  @Post('gold-transfer/policy/add')
  async goldTransferPolicyAdd(@Body() dto: GoldTransferPolicyAddDto, @Req() req: Request) {
    return await this.goldTransferPolicyService.goldTransferPolicyAdd(dto, req.user.id);
  }

  /** 转金策略-编辑 */
  @Post('gold-transfer/policy/edit')
  async goldTransferPolicyEdit(@Body() dto: GoldTransferPolicyEditDto, @Req() req: Request) {
    return await this.goldTransferPolicyService.goldTransferPolicyEdit(dto, req.user.id);
  }

  /** 转金策略-删除 */
  @Post('gold-transfer/policy/delete')
  async goldTransferPolicyDelete(@Body() dto: GoldTransferPolicyIdDto, @Req() req: Request) {
    return await this.goldTransferPolicyService.goldTransferPolicyDelete(dto.id, req.user.id);
  }

  /** 转金策略-分页 */
  @Post('gold-transfer/policy/list')
  async goldTransferPolicyList(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.goldTransferPolicyService.goldTransferPolicyList(dto, req.user.id);
  }
}

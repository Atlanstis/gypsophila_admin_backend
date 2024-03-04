import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MhxyService } from './mhxy.service';
import { CommonPageDto, JwtGuard } from 'src/core';
import {
  MhxyAccountDto,
  MhxyAccountEditDto,
  MhxyAccountGoldRecordDto,
  MhxyAccountIdDto,
} from './dto';
import { MhxyGoldTradeCategoryService } from './mhxy-gold-trade-category.service';
import { MhxyAccountGoldRecordService } from './mhxy-account-gold-record.service';

@Controller('mhxy')
@UseGuards(JwtGuard)
export class MhxyController {
  constructor(
    private readonly mhxyService: MhxyService,
    private readonly mhxyCategoryService: MhxyGoldTradeCategoryService,
    private readonly mhxyAccountGoldRecordService: MhxyAccountGoldRecordService,
  ) {}

  /** 获取梦幻账号数据 */
  @Post('/account/list')
  async accountList(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.mhxyService.accountList(dto, req.user.id);
  }

  /** 获取当前用户下所有梦幻账号数据 */
  @Post('/account/all')
  async accountAll(@Req() req: Request) {
    return await this.mhxyService.accountAll(req.user.id);
  }

  /** 新增账号数据 */
  @Post('/account/add')
  async accountAdd(@Body() dto: MhxyAccountDto, @Req() req: Request) {
    return await this.mhxyService.accountAdd(dto, req.user.id);
  }

  /** 编辑账号数据 */
  @Post('/account/edit')
  async accountEdit(@Body() dto: MhxyAccountEditDto, @Req() req: Request) {
    return await this.mhxyService.accountEdit(dto, req.user.id);
  }

  /** 删除账号数据 */
  @Post('/account/delete')
  async asscountDelete(@Body() dto: MhxyAccountIdDto, @Req() req: Request) {
    return await this.mhxyService.accountDelete(dto.id, req.user.id);
  }

  /** 获取角色数据 */
  @Get('/account/role')
  async accountRole() {
    return await this.mhxyService.accountRole();
  }

  /** 获取门派数据 */
  @Get('/account/sect')
  async accountSect() {
    return await this.mhxyService.accountSect();
  }

  /** 获取贸易种类 */
  @Get('/gold-trade-category/list')
  async goldTradeCategoryList() {
    return await this.mhxyCategoryService.goldTradeCategoryList();
  }

  /** 获取金币收支记录 */
  @Post('/account/gold-record/list')
  async goldRecordList(@Body() dto: CommonPageDto, @Req() req: Request) {
    return await this.mhxyAccountGoldRecordService.goldRecordList(dto, req.user.id);
  }

  /** 新增金币收支记录 */
  @Post('/account/gold-record/add')
  async goldRecordAdd(@Body() dto: MhxyAccountGoldRecordDto, @Req() req: Request) {
    return await this.mhxyAccountGoldRecordService.goldRecordAdd(dto, req.user.id);
  }
}

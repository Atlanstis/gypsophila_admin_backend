import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { JwtGuard } from 'src/core';
import { Request } from 'express';

@Controller('notice')
@UseGuards(JwtGuard)
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  /** 获取系统消息（顶部提示） */
  @Get('/polymeric')
  async polymeric(@Req() req: Request) {
    return await this.noticeService.polymeric(req.user.id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumNoticeStatus } from 'src/constants';
import { Notice, User } from 'src/entities';
import { nowDate } from 'src/utils';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRep: Repository<Notice>,
  ) {}

  /** 获取系统消息（顶部提示） */
  async polymeric(userId: User['id']) {
    // 获取前 100 条，生效中，且过期时间大于当前时间的消息
    const notices = await this.noticeRep.find({
      where: {
        status: EnumNoticeStatus.Active,
        expireTime: MoreThan(nowDate()),
        user: {
          id: userId,
        },
      },
      take: 100,
    });
    return notices;
  }
}

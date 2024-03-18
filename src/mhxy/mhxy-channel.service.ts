import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MHXY_CHANNEL_TOP_FLAG } from 'src/constants';
import { BusinessException } from 'src/core';
import { MhxyChannel } from 'src/entities';
import { Repository } from 'typeorm';
import { ChannelAddDto, ChannelDeleteDto, ChannelEditDto } from './dto';

@Injectable()
/** 梦幻途径相关服务 */
export class MhxyChannelService {
  constructor(
    @InjectRepository(MhxyChannel)
    private readonly channelRepository: Repository<MhxyChannel>,
  ) {}

  /** 途径-新增 */
  async channelAdd(dto: ChannelAddDto) {
    let parentChannel: MhxyChannel;
    if (dto.parentId) {
      parentChannel = await this.channelRepository.findOne({
        where: {
          id: dto.parentId,
        },
      });
      if (!parentChannel) {
        throw new BusinessException('父级途径不存在');
      }
    }
    const channel = this.channelRepository.create({
      ...dto,
      parentId: parentChannel ? parentChannel.id : MHXY_CHANNEL_TOP_FLAG,
    });
    await this.channelRepository.save(channel);
  }

  /** 途径-编辑 */
  async channelEdit(dto: ChannelEditDto) {
    const channel = await this.channelRepository.findOne({
      where: {
        id: dto.id,
      },
    });
    if (!channel) {
      throw new BusinessException('当前途径不存在');
    }
    if (channel.isDefault) {
      throw new BusinessException('默认途径不允许编辑');
    }
    const newChannel = this.channelRepository.create({
      ...channel,
      ...dto,
    });
    await this.channelRepository.save(newChannel);
  }

  /** 途径-删除 */
  async channelDelete(dto: ChannelDeleteDto) {
    const channel = await this.channelRepository.findOne({
      where: {
        id: dto.id,
      },
    });
    if (!channel) {
      throw new BusinessException('当前途径不存在');
    }
    if (channel.isDefault) {
      throw new BusinessException('默认途径不允许编辑');
    }
    const child = await this.channelRepository.findOne({
      where: {
        parentId: channel.id,
      },
    });
    if (child) {
      throw new BusinessException('当前途径存在子途径，请先删除子途径');
    }
    return await this.channelRepository.remove(channel);
  }

  /** 途径-分页 */
  async channelList() {
    const data = await this.channelRepository.find({});
    // 获取一级道具种类
    const top = data.filter((item) => item.parentId === MHXY_CHANNEL_TOP_FLAG);
    this.getChannelChildren(top, data);
    return top;
  }

  /** 整理子途径 */
  getChannelChildren(parents: MhxyChannel[], all: MhxyChannel[]) {
    parents.forEach((item) => {
      const children = all.filter((child) => child.parentId === item.id);
      item.children = children;
      this.getChannelChildren(children, all);
    });
  }
}

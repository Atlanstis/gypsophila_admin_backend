import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MhxyAccountGroup } from 'src/entities';
import { FindOptionsRelations, Repository } from 'typeorm';
import {
  AccountGroupAddDto,
  AccountGroupEditDto,
  AccountGroupIdDto,
  AccountGroupListDto,
} from './dto';
import { UserService } from 'src/user/user.service';
import { BusinessException } from 'src/core';

@Injectable()
export class MhxyAccountGroupService {
  constructor(
    @InjectRepository(MhxyAccountGroup)
    private readonly groupRepository: Repository<MhxyAccountGroup>,
    private readonly userService: UserService,
  ) {}

  /** 账号分组-列表 */
  async accountGroupList(dto: AccountGroupListDto, userId: string) {
    let relations: FindOptionsRelations<MhxyAccountGroup> = {};
    // 查找，该分组下的账号
    if (dto.showItem) {
      relations = {
        items: {
          account: true,
        },
      };
    }
    return await this.groupRepository.find({ where: { user: { id: userId } }, relations });
  }

  /** 账号分组-新增 */
  async accountGroupAdd(dto: AccountGroupAddDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    const group = this.groupRepository.create({ user, ...dto });
    await this.groupRepository.save(group);
  }

  /** 账号分组-编辑 */
  async accountGroupEdit(dto: AccountGroupEditDto, userId: string) {
    const group = await this.groupRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
    });
    if (!group) {
      throw new BusinessException('分组不存在，或者无操作的权限');
    }
    await this.groupRepository.update(group.id, { ...dto });
  }

  /** 账号分组-删除 */
  async accountGroupDelete(dto: AccountGroupIdDto, userId: string) {
    const group = await this.groupRepository.findOne({
      where: {
        id: dto.id,
        user: {
          id: userId,
        },
      },
      relations: {
        items: true,
      },
    });
    if (!group) {
      throw new BusinessException('分组不存在，或者无操作的权限');
    }
    if (group.items.length) {
      throw new BusinessException('当前分组正在被使用，无法删除，请先删除分组下的账号');
    }
    await this.groupRepository.remove(group);
  }
}

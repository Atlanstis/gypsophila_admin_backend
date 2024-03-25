import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MHXY_ACCOUNT_ROLE_OPTS, MHXY_ACCOUNT_SECT_OPTS } from 'src/constants';
import { BusinessException, CommonPageDto } from 'src/core';
import { MhxyAccount, MhxyAccountGroup, MhxyAccountGroupItem } from 'src/entities';
import {
  DataSource,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { MhxyAccountDto, MhxyAccountEditDto, MhxyAccountIdDto } from './dto';
import { UserService } from '../user/user.service';
import { useTransaction } from 'src/utils/transaction';

@Injectable()
/** 梦幻账号相关服务 */
export class MhxyAccountService {
  constructor(
    @InjectRepository(MhxyAccount)
    private readonly mhxyAccountRepository: Repository<MhxyAccount>,
    @InjectRepository(MhxyAccountGroup)
    private readonly groupRepository: Repository<MhxyAccountGroup>,
    private readonly userService: UserService,
    private dataSource: DataSource,
  ) {}

  /** 查询账号列表 */
  async accountList(dto: CommonPageDto, userId: string) {
    const { page, size } = dto;
    const [list, total] = await this.mhxyAccountRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        groupItem: {
          group: true,
        },
      },
    });
    return { list, total };
  }

  /** 获取当前用户下所有梦幻账号数据 */
  async accountAll(userId: string) {
    return this.mhxyAccountRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  /** 新增账号数据 */
  async accountAdd(dto: MhxyAccountDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    if (!user) {
      throw new BusinessException('当前用户不存在');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const account = this.mhxyAccountRepository.create({ ...dto, user });
      await queryRunner.manager.save(account);
      // 处理分组信息
      if (dto.groupId) {
        const group = await queryRunner.manager.findOne(MhxyAccountGroup, {
          where: { id: dto.groupId, user: { id: userId } },
        });
        if (!group) {
          throw new BusinessException('分组不存在');
        }
        // 新增分组项信息
        const groupItem = queryRunner.manager.create(MhxyAccountGroupItem, {
          group,
          account,
          remark: dto.groupRemark,
        });
        await queryRunner.manager.save(groupItem);
      }
      // 提交事务
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /** 编辑账号数据 */
  async accountEdit(dto: MhxyAccountEditDto, userId: string) {
    const user = await this.userService.findOneByUser({ id: userId });
    if (!user) {
      throw new BusinessException('当前用户不存在');
    }
    const account = await this.findAccount(
      { id: dto.id, user: { id: userId } },
      { groupItem: true },
    );
    if (!account) {
      throw new BusinessException('当前账号不存在');
    }

    async function inProcess(manager: EntityManager) {
      if (dto.groupId) {
        // 编辑后有分组，新增或更新分组信息
        const group = await manager.findOne(MhxyAccountGroup, {
          where: { id: dto.groupId, user: { id: userId } },
        });
        if (!group) {
          throw new BusinessException('分组不存在');
        }
        // 保存分组信息
        const groupItem = manager.create(MhxyAccountGroupItem, {
          id: account.groupItem ? account.groupItem.id : undefined,
          account,
          group,
          remark: dto.groupRemark,
        });
        await manager.save(groupItem);
        account.groupItem = groupItem;
      } else {
        // 编辑后无分组
        if (account.groupItem) {
          // 编辑前有分组，删除分组信息
          await manager.delete(MhxyAccountGroupItem, { id: account.groupItem.id });
        }
      }
      const newAccount = manager.create(MhxyAccount, {
        ...account,
        ...dto,
      });
      await manager.save(newAccount);
    }
    await useTransaction(this.dataSource, inProcess);
  }

  /** 删除账号数据 */
  async accountDelete(id: MhxyAccountIdDto['id'], userId: string) {
    const mhxyAccount = await this.findAccount({ id: id, user: { id: userId } });
    if (!mhxyAccount) {
      throw new BusinessException('当前账号不存在');
    }
    await this.mhxyAccountRepository.remove(mhxyAccount);
  }

  /** 获取角色数据 */
  async accountRole() {
    return MHXY_ACCOUNT_ROLE_OPTS;
  }

  /** 获取门派数据 */
  async accountSect() {
    return MHXY_ACCOUNT_SECT_OPTS;
  }

  /** 查找账号 */
  async findAccount(
    where: FindOptionsWhere<MhxyAccount>,
    relations?: FindOptionsRelations<MhxyAccount>,
  ) {
    return await this.mhxyAccountRepository.findOne({ where, relations });
  }
}

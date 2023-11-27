import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, RoleIsDefaultEnum } from 'src/entities';
import { Repository } from 'typeorm';
import { RoleDto, RoleEditDto } from './dto';
import { BusinessException } from 'src/core';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 获取角色列表
   * @param page 页码
   * @param size 条数
   * @returns 角色列表
   */
  async list(page: number, size: number) {
    const [list, total] = await this.roleRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: {
        createTime: 'ASC',
      },
    });
    return { list, total };
  }

  /**
   * 新增角色
   * @param dto 角色信息
   */
  async add(dto: RoleDto) {
    const existedRole = await this.roleRepository.findOne({ where: { name: dto.name } });
    if (existedRole) {
      throw new BusinessException('角色名已存在');
    }
    await this.roleRepository.save({ name: dto.name });
  }

  /**
   * 编辑角色
   * @param dto 角色信息
   */
  async edit(dto: RoleEditDto) {
    const existedRole = await this.roleRepository.findOne({ where: { id: dto.id } });
    if (!existedRole) {
      throw new BusinessException('角色不存在');
    }
    await this.roleRepository.update({ id: dto.id }, { name: dto.name });
  }

  /**
   * 删除角色
   * @param id 角色 id
   */
  async delete(id: number) {
    const existedRole = await this.roleRepository.findOne({ where: { id: id } });
    if (!existedRole) {
      throw new BusinessException('角色不存在');
    }
    if (existedRole.isDefault === RoleIsDefaultEnum.YES) {
      throw new BusinessException('内置角色不能删除');
    }
    await this.roleRepository.delete({ id });
  }
}
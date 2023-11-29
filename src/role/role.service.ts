import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, RoleIsDefaultEnum } from 'src/entities';
import { Not, Repository } from 'typeorm';
import { RoleDto, RoleEditDto, RoleMenuEditDto } from './dto';
import { BusinessException } from 'src/core';
import { RoleEnum } from 'src/enum';
import { MenuService } from 'src/menu/menu.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly menuService: MenuService,
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
    const newRole = this.roleRepository.create({ ...dto });
    await this.roleRepository.save(newRole);
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
    const updateRole = this.roleRepository.create(dto);
    await this.roleRepository.update({ id: dto.id }, updateRole);
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

  /**
   * 获取可以分配的角色
   * @returns 除超级管理员外的角色
   */
  async assignable() {
    return await this.roleRepository.find({ where: { id: Not(RoleEnum.Admin) } });
  }

  /**
   * 获取该角色下可以访问的菜单
   * @param id 角色 id
   * @returns 授权菜单
   */
  async menu(id: number) {
    const role = await this.roleRepository.findOne({
      select: { menus: true },
      where: { id },
      relations: { menus: true },
    });
    if (!role) {
      throw new BusinessException('该角色不存在');
    }
    return role.menus.map((item) => item.key);
  }

  /**
   * 编辑该角色下可以访问的菜单
   */
  async menuEdit(dto: RoleMenuEditDto) {
    const role = await this.findRoleById(dto.id);
    if (!role) {
      throw new BusinessException('该角色不存在');
    }
    if (role.id === RoleEnum.Admin) {
      throw new BusinessException('管理员权限不能编辑');
    }
    const menus = await this.menuService.getMenuByKey(dto.menus);
    const saveRole = this.roleRepository.create({ ...role, menus });
    await this.roleRepository.save(saveRole);
  }

  /**
   * 根据 id 获取角色
   * @param id 角色 id
   * @returns 角色
   */
  async findRoleById(id: number) {
    return await this.roleRepository.findOne({ where: { id } });
  }
}

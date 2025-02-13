import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, MenuPermission } from 'src/entities';
import { DataSource, FindOptionsWhere, Not, Repository } from 'typeorm';
import { PermissionAddDto, PermissionEditDto } from './dto';
import { findOneByExistError, findOneByNotExistError } from 'src/utils';

@Injectable()
export class MenuPermissionService {
  constructor(
    @InjectRepository(MenuPermission)
    private readonly mpRepo: Repository<MenuPermission>,
    private dataSource: DataSource,
  ) {}

  /**
   * 获取菜单权限选项
   * @param menuId 菜单 id
   */
  async getPermissionList(where: FindOptionsWhere<Menu>) {
    // 判断当前菜单是否存在
    const menu = await findOneByNotExistError(
      this.dataSource,
      Menu,
      where,
      '该菜单不存在',
    );
    const permissions = await this.mpRepo.find({
      where: { menuId: menu.id },
    });
    return permissions;
  }

  /**
   * 菜单增加权限选项
   * @param dto 权限
   */
  async permissionAdd(dto: PermissionAddDto) {
    // 判断当前菜单是否存在
    const menu = await findOneByNotExistError(
      this.dataSource,
      Menu,
      { id: dto.menuId },
      '所属菜单不存在',
    );
    // 判断当前权限标识是否存在
    await findOneByExistError(
      this.dataSource,
      MenuPermission,
      { key: dto.key },
      '该权限标识已存在',
    );
    const permission = this.mpRepo.create({ ...dto, menu });
    await this.mpRepo.save(permission);
  }

  /**
   * 菜单权限选项编辑
   * @param dto 权限
   */
  async permissionEdit(dto: PermissionEditDto) {
    // 判断当前菜单是否存在
    const menu = await findOneByNotExistError(
      this.dataSource,
      Menu,
      { id: dto.menuId },
      '所属菜单不存在',
    );
    // 判断当前权限标识是否存在
    await findOneByExistError(
      this.dataSource,
      MenuPermission,
      { key: dto.key, id: Not(dto.id) },
      '该权限标识已存在',
    );
    const permission = this.mpRepo.create({ ...dto, menu });
    await this.mpRepo.save(permission);
  }

  /**
   * 菜单权限选项删除
   * @param id 权限 id
   */
  async permissionDelete(id: number) {
    // 判断当前权限是否存在
    await findOneByNotExistError(
      this.dataSource,
      MenuPermission,
      { id },
      '该权限不存在',
    );
    await this.mpRepo.delete({ id });
  }
}

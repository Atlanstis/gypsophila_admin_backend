import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { MenuAddDto, MenuEditDto } from './dto';
import { BusinessException } from 'src/core';
import { sortMenuChildren } from './helper';
import { findOneBy } from 'src/utils';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    private dataSource: DataSource,
  ) {}

  /**
   * 根据页码跟长度获取一、二级菜单
   * @param page 页码
   * @param size 长度
   * @returns 菜单列表
   */
  async list(page: number, size: number) {
    const [list, total] = await this.menuRepo.findAndCount({
      where: {
        parentId: IsNull(),
      },
      skip: (page - 1) * size,
      take: size,
      order: {
        order: 'ASC',
      },
    });
    const children = await this.getSecondaryMenu(list);
    const menus = sortMenuChildren(list, children);
    return { list: menus, total };
  }

  /** 获取所有菜单及下面的菜单 */
  async getMenuPermissions() {
    const topMenus = await this.menuRepo.find({
      where: { parentId: IsNull() },
      order: {
        order: 'ASC',
      },
    });
    const children = await this.getSecondaryMenu(topMenus, true);
    return sortMenuChildren(topMenus, children);
  }

  /**
   * 添加菜单
   * @param dto 菜单数据
   */
  async add(dto: MenuAddDto) {
    await findOneBy(
      this.dataSource,
      Menu,
      { key: dto.key },
      (menu) => !!menu,
      '菜单标识已存在，请更换后重试',
    );

    const newMenu = this.menuRepo.create(dto);
    // 判断上级菜单是否存在
    if (dto.parentId) {
      const parent = await findOneBy(
        this.dataSource,
        Menu,
        { id: dto.parentId },
        (menu) => !menu,
        '上级菜单不存在',
      );
      newMenu.parent = parent;
    }
    await this.menuRepo.save(newMenu);
  }

  /**
   * 编辑菜单
   * @param dto 菜单数据
   */
  async edit(dto: MenuEditDto) {
    // 判断当前菜单是否存在
    await findOneBy(
      this.dataSource,
      Menu,
      { id: dto.id },
      (menu) => !menu,
      '该菜单不存在',
    );
    // 判断菜单标识已否被使用
    await findOneBy(
      this.dataSource,
      Menu,
      { key: dto.key, id: Not(dto.id) },
      (menu) => !!menu,
      '当前菜单标识已存在',
    );
    const newMenu = this.menuRepo.create(dto);
    await this.menuRepo.save(newMenu);
  }

  /**
   * 删除菜单
   * @param id 菜单 id
   */
  async delete(id: number) {
    // 判断当前菜单是否存在
    const menu = await findOneBy(
      this.dataSource,
      Menu,
      { id: id },
      (menu) => !menu,
      '该菜单不存在',
    );
    // 如含有子菜单，则不让删除
    const child = await this.menuRepo.findOne({
      where: { parentId: menu.id },
    });
    if (child) {
      throw new BusinessException('请先删除相关的子菜单');
    }
    await this.menuRepo.delete({ id });
  }

  /** 获取一级菜单数据 */
  async listTop() {
    return await this.menuRepo.find({
      where: {
        parentId: IsNull(),
      },
      order: {
        order: 'ASC',
      },
    });
  }

  /**
   * 获取顶级菜单的子菜单
   * @param topMenus 顶级菜单
   * @param hasPermission 是否关联查询权限
   * @returns 菜单
   */
  async getSecondaryMenu(topMenus: Menu[], hasPermission = false) {
    const parentIds = topMenus.map((menu) => menu.id);
    const children = await this.menuRepo.find({
      where: {
        parentId: In(parentIds),
      },
      relations: {
        permissions: hasPermission,
      },
    });
    return children;
  }
}

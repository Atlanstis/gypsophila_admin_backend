import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, TOP_LEVEL_MENU_FLAG } from 'src/entities';
import { FindOptionsSelect, In, Not, Repository } from 'typeorm';
import { MenuDto, MenuEditDto } from './dto';
import { BusinessException } from 'src/core';

type MenuBusiness = {
  [P in Exclude<keyof Menu, 'createTime' | 'updateTime'>]: Menu[P];
} & {
  children?: MenuBusiness[];
};

const select: FindOptionsSelect<Menu> = { id: true, key: true, name: true, parentId: true };

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepoitory: Repository<Menu>,
  ) {}

  /**
   * 根据页码跟长度获取一级菜单列表及其子菜单
   * @param page 页码
   * @param size 长度
   * @returns 菜单列表
   */
  async list(page: number, size: number) {
    const [list, total] = await this.menuRepoitory.findAndCount({
      select,
      where: {
        parentId: TOP_LEVEL_MENU_FLAG,
      },
      skip: (page - 1) * size,
      take: size,
      order: {
        createTime: 'ASC',
      },
    });
    const parentIds = list.map((menu) => menu.id);
    const children = await this.menuRepoitory.find({
      select,
      where: {
        parentId: In(parentIds),
      },
    });
    const menus: MenuBusiness[] = list;
    children.forEach((child) => {
      const father = menus.find((menu) => menu.id === child.parentId);
      if (father) {
        if (father.children) {
          father.children.push(child);
        } else {
          father.children = [child];
        }
      }
    });
    return { list: menus, total };
  }

  /**
   * 添加菜单
   * @param dto 菜单数据
   */
  async add(dto: MenuDto) {
    // 判断 key 是否已存在
    const existMenu = await this.menuRepoitory.findOne({ where: { key: dto.key } });
    if (existMenu) {
      throw new BusinessException('菜单 Key 已存在');
    }
    // 判断上级菜单是否存在
    if (dto.parentId !== TOP_LEVEL_MENU_FLAG) {
      const parentMenu = await this.menuRepoitory.findOne({ where: { id: dto.parentId } });
      if (!parentMenu) {
        throw new BusinessException('上级菜单不存在');
      }
    }
    const newMenu = this.menuRepoitory.create(dto);
    await this.menuRepoitory.save(newMenu);
  }

  /**
   * 编辑菜单
   * @param dto 菜单数据
   */
  async edit(dto: MenuEditDto) {
    // 判断当前菜单是否存在
    const existMenu = await this.menuRepoitory.findOne({ where: { id: dto.id } });
    if (!existMenu) {
      throw new BusinessException('该菜单不存在');
    }
    // 判断 Key 已否被使用
    const existKeyMenu = await this.menuRepoitory.findOne({
      where: { key: dto.key, id: Not(dto.id) },
    });
    if (existKeyMenu) {
      throw new BusinessException('当前菜单 Key 已存在');
    }
    const newMenu = this.menuRepoitory.create(dto);
    await this.menuRepoitory.update({ id: dto.id }, newMenu);
  }

  /**
   * 删除菜单
   * @param id 菜单 id
   */
  async delete(id: number) {
    // 判断当前菜单是否存在
    const existMenu = await this.menuRepoitory.findOne({ where: { id } });
    if (!existMenu) {
      throw new BusinessException('该菜单不存在');
    }
    // 如含有子菜单，则不让删除
    const children = await this.menuRepoitory.find({ where: { parentId: id } });
    if (children.length) {
      throw new BusinessException('请先删除相关的子菜单');
    }
    await this.menuRepoitory.delete({ id });
  }

  /** 获取一级菜单数据 */
  async listTop() {
    return await this.menuRepoitory.find({
      select,
      where: {
        parentId: TOP_LEVEL_MENU_FLAG,
      },
    });
  }
}

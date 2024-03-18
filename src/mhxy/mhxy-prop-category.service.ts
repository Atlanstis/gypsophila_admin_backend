import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MHXY_PROP_CATEGORY_TOP_FLAG } from 'src/constants';
import { MhxyPropCategory } from 'src/entities';
import { Repository } from 'typeorm';
import { PropCategoryAddDto, PropCategoryDeleteDto, PropCategoryEditDto } from './dto';
import { BusinessException } from 'src/core';

@Injectable()
/** 梦幻道具种类相关服务 */
export class MhxyPropCategoryService {
  constructor(
    @InjectRepository(MhxyPropCategory)
    private readonly propCategoryRepository: Repository<MhxyPropCategory>,
  ) {}

  /** 道具种类-新增 */
  async propCategoryAdd(dto: PropCategoryAddDto) {
    let parentCategory: MhxyPropCategory;
    if (dto.parentId) {
      parentCategory = await this.propCategoryRepository.findOne({
        where: {
          id: dto.parentId,
        },
      });
      if (!parentCategory) {
        throw new BusinessException('父级道具种类不存在');
      }
    }
    const category = this.propCategoryRepository.create({
      ...dto,
      parentId: parentCategory ? parentCategory.id : MHXY_PROP_CATEGORY_TOP_FLAG,
    });
    await this.propCategoryRepository.save(category);
  }

  /** 道具种类-编辑 */
  async propCategoryEdit(dto: PropCategoryEditDto) {
    const category = await this.propCategoryRepository.findOne({
      where: {
        id: dto.id,
      },
    });
    if (!category) {
      throw new BusinessException('当前道具种类不存在');
    }
    const newCategory = this.propCategoryRepository.create({
      ...category,
      ...dto,
    });
    await this.propCategoryRepository.save(newCategory);
  }

  /** 道具种类-删除 */
  async propCategoryDelete(dto: PropCategoryDeleteDto) {
    const category = await this.propCategoryRepository.findOne({
      where: {
        id: dto.id,
      },
    });
    if (!category) {
      throw new BusinessException('当前道具种类不存在');
    }
    const child = await this.propCategoryRepository.findOne({
      where: {
        parentId: category.id,
      },
    });
    if (child) {
      throw new BusinessException('当前道具种类存在子道具种类，请先删除子道具种类');
    }
    return await this.propCategoryRepository.remove(category);
  }

  /** 道具种类-分页 */
  async propCategoryList() {
    const data = await this.propCategoryRepository.find({});
    // 获取一级道具种类
    const top = data.filter((item) => item.parentId === MHXY_PROP_CATEGORY_TOP_FLAG);
    this.getPropCategoryChildren(top, data);
    return top;
  }

  /** 整理子商品分类 */
  getPropCategoryChildren(parents: MhxyPropCategory[], all: MhxyPropCategory[]) {
    parents.forEach((item) => {
      const children = all.filter((child) => child.parentId === item.id);
      item.children = children;
      this.getPropCategoryChildren(children, all);
    });
  }
}

import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { BusinessException, JwtGuard, PageDto } from 'src/core';
import { MenuDto, MenuEditDto } from './dto';

const numberParse = (parameter) =>
  new ParseIntPipe({
    exceptionFactory: () => {
      throw new BusinessException(`${parameter} 参数格式错误`);
    },
  });

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /** 根据页码跟长度获取一级菜单列表及其子菜单 */
  @Post('/list')
  @UseGuards(JwtGuard)
  async list(@Body() dto: PageDto) {
    return await this.menuService.list(dto.page, dto.size);
  }

  /** 获取一级菜单数据 */
  @Get('/list/top')
  @UseGuards(JwtGuard)
  async listAll() {
    return await this.menuService.listTop();
  }

  /** 添加菜单 */
  @Post('/add')
  @UseGuards(JwtGuard)
  async add(@Body() dto: MenuDto) {
    return await this.menuService.add(dto);
  }

  /** 编辑菜单 */
  @Post('/edit')
  @UseGuards(JwtGuard)
  async edit(@Body() dto: MenuEditDto) {
    return await this.menuService.edit(dto);
  }

  /** 删除菜单 */
  @Get('/delete')
  @UseGuards(JwtGuard)
  async delete(@Query('id', numberParse('id')) id: number) {
    return await this.menuService.delete(id);
  }
}

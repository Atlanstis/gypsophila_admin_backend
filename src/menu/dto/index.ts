import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { MENU_LENGTH_ENUM } from 'src/constants';

export class MenuDto {
  @IsNotEmpty({ message: '菜单名称不能为空' })
  @Length(1, MENU_LENGTH_ENUM.KEY_MAX, {
    message: `菜单名称长度为 1 - ${MENU_LENGTH_ENUM.KEY_MAX} 个字符`,
  })
  /** 菜单名称 */
  name: string;
  @IsNotEmpty({ message: '菜单 Key 不能为空' })
  @Length(1, MENU_LENGTH_ENUM.NAME_MAX, {
    message: `菜单 Key 长度为 1 - ${MENU_LENGTH_ENUM.NAME_MAX} 个字符`,
  })
  /** 菜单 Key */
  key: string;
  /** 父菜单 id */
  @IsNumber({}, { message: '父菜单 id 必须为数字' })
  parentId: number;
}

export class MenuEditDto extends MenuDto {
  @IsNotEmpty({ message: '菜单 id 不能为空' })
  id: number;
}

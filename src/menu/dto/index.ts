import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { MENU_KEY_MAX_LENGTH, MENU_NAME_MAX_LENGTH } from 'src/entities';

export class MenuDto {
  @IsNotEmpty({ message: '菜单名称不能为空' })
  @Length(1, MENU_NAME_MAX_LENGTH, { message: `菜单名称长度为 1 - ${MENU_NAME_MAX_LENGTH} 个字符` })
  /** 菜单名称 */
  name: string;
  @IsNotEmpty({ message: '菜单 Key 不能为空' })
  @Length(1, MENU_KEY_MAX_LENGTH, { message: `菜单 Key 长度为 1 - ${MENU_KEY_MAX_LENGTH} 个字符` })
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

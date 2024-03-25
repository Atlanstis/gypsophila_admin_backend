import { Allow, IsNotEmpty, Length } from 'class-validator';
import { MHXY_ACCOUNT_GROUP_LENGTH } from 'src/constants';
import { MhxyAccountGroup } from 'src/entities';

/** 账号分组-新增 */
export class AccountGroupAddDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_ACCOUNT_GROUP_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_ACCOUNT_GROUP_LENGTH.NAME_MAX} 个字符`,
  })
  name: MhxyAccountGroup['name'];
}

export class AccountGroupIdDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyAccountGroup['id'];
}

/** 账号分组-编辑 */
export class AccountGroupEditDto extends AccountGroupAddDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyAccountGroup['id'];
}

export class AccountGroupListDto {
  @Allow()
  showItem: boolean;
}

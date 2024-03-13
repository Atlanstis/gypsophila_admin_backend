import { Allow, IsNotEmpty, Length } from 'class-validator';
import { MHXY_CHANNEL_LENGTH } from 'src/constants';
import { MhxyChannel } from 'src/entities';

/** 途径 */
export class ChannelBaseDto {
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, MHXY_CHANNEL_LENGTH.NAME_MAX, {
    message: `name 长度为 1 - ${MHXY_CHANNEL_LENGTH.NAME_MAX} 个字符`,
  })
  name: MhxyChannel['name'];
  @Allow()
  isGem: boolean;
}

/** 途径-新增 */
export class ChannelAddDto extends ChannelBaseDto {
  @Allow()
  parentId?: MhxyChannel['id'];
}

/** 途径-编辑 */
export class ChannelEditDto extends ChannelBaseDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyChannel['id'];
}

/** 道具种类-删除 */
export class ChannelDeleteDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: MhxyChannel['id'];
}

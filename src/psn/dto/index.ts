import { IsNotEmpty, Length, IsNumber, IsIn, Validate, IsUrl } from 'class-validator';
import {
  PSN_PROFILE_LENGTH,
  PSN_PROFILE_GAME_GUIDE_LENGTH,
  PSN_PROFILE_GAME_GUIDE_TYPE_ENUM,
} from 'src/constants';
import { GameGuideUrlValidator } from './custom-validation';

export class PsnIdDto {
  @IsNotEmpty({ message: 'psnId 不能为空' })
  @Length(1, PSN_PROFILE_LENGTH.PSN_ID_MAX, {
    message: `psnId 长度为 1 - ${PSN_PROFILE_LENGTH.PSN_ID_MAX} 个字符`,
  })
  psnId: string;
}

export class PageDto {
  @IsNotEmpty({ message: 'page 不能为空' })
  @IsNumber({}, { message: 'page 类型错误' })
  page?: number;
}

export class PsnineGameDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  @IsNumber({}, { message: 'id 类型错误' })
  gameId: number;
}

export class PsnProfileGameDto {
  @IsNotEmpty({ message: 'ppgId 不能为空' })
  ppgId: string;
}

export class PsnProfileGameGuideDto extends PsnProfileGameDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @Length(1, PSN_PROFILE_LENGTH.PSN_ID_MAX, {
    message: `title 长度为 1 - ${PSN_PROFILE_GAME_GUIDE_LENGTH.TITLE_MAX} 个字符`,
  })
  title: string;

  @IsIn([PSN_PROFILE_GAME_GUIDE_TYPE_ENUM.TEXT, PSN_PROFILE_GAME_GUIDE_TYPE_ENUM.URL], {
    message: 'type 错误',
  })
  type: PSN_PROFILE_GAME_GUIDE_TYPE_ENUM;

  @Validate(GameGuideUrlValidator, [1, PSN_PROFILE_GAME_GUIDE_LENGTH.URL_MAX], {
    message: `url 的长度为 1 - ${PSN_PROFILE_GAME_GUIDE_LENGTH.URL_MAX} 个字符`,
  })
  @IsUrl(
    { protocols: ['https', 'http'], require_protocol: true },
    { message: `url 不符合格式要求` },
  )
  url: string;
}

export class PsnProfileGameGuideEditDto extends PsnProfileGameGuideDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

export class PsnProfileGameGuideDeleteDto extends PsnProfileGameDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

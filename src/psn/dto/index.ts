import { IsNotEmpty, Length, IsNumber } from 'class-validator';
import { PSN_PROFILE_LENGTH } from 'src/constants';

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

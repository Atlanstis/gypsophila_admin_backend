import { IsNotEmpty, Length } from 'class-validator';
import { PSN_PROFILE_LENGTH } from 'src/constants';

export class PsnIdDto {
  @IsNotEmpty({ message: 'psnId 不能为空' })
  @Length(1, PSN_PROFILE_LENGTH.PSN_ID_MAX, {
    message: `psnId 长度为 1 - ${PSN_PROFILE_LENGTH.PSN_ID_MAX} 个字符`,
  })
  psnId: string;
}

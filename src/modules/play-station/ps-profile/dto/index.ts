import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Const_PsProfile } from '../../constants';
import { PickType } from '@nestjs/mapped-types';
import { CommonPageDto } from 'src/core';

export class PsnIdDto {
  @Length(0, Const_PsProfile.psnIdMax, {
    message: `PSNID 最大长度不能超过 ${Const_PsProfile.psnIdMax} 个字符`,
  })
  @IsNotEmpty({ message: 'PSNID 不能为空' })
  psnId: string;
}

export class PageDto extends PickType(CommonPageDto, ['page']) {}

export class ProfileGameIdDto {
  @IsNumber({}, { message: 'profileGameId 类型错误' })
  @IsNotEmpty({ message: 'profileGameId 不能为空' })
  profileGameId: number;
}

export class PsnineGameIdDto {
  @IsNumber({}, { message: 'id 类型错误' })
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

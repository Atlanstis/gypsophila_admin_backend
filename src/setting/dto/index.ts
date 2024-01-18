import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { SETTING_LENGTH } from 'src/constants';

export class WebsiteDto {
  @IsNotEmpty({ message: '网站名称不能为空' })
  @Length(1, SETTING_LENGTH.VALUE_MAX, {
    message: `网站名称长度不能超过 ${SETTING_LENGTH.VALUE_MAX}`,
  })
  name: string;
  @IsNotEmpty({ message: '备案号不能为空' })
  @Length(1, SETTING_LENGTH.VALUE_MAX, {
    message: `网站名称长度不能超过 ${SETTING_LENGTH.VALUE_MAX}`,
  })
  recordNumber: string;
  @IsNotEmpty({ message: '是否展示备案号不能为空' })
  @IsBoolean({ message: '是否展示备案号类型错误' })
  showRecordNumber: boolean;
}

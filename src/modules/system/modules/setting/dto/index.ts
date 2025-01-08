import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { Const_SystemSetting } from 'src/modules/system/constants';

export class WebsiteDto {
  @Length(0, Const_SystemSetting.valueMax, {
    message: `网站名称长度不能超过 ${Const_SystemSetting.valueMax}`,
  })
  @IsNotEmpty({ message: '网站名称不能为空' })
  websiteName: string;

  @Length(0, Const_SystemSetting.valueMax, {
    message: `网站备案号不能超过 ${Const_SystemSetting.valueMax}`,
  })
  websiteRecordNumber: string;

  @IsBoolean({ message: '是否展示备案号类型错误' })
  webisteShowRecordNumber: boolean;
}

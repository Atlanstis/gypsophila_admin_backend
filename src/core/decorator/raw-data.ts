import { SetMetadata } from '@nestjs/common';

export const IS_RAW_DATA = 'is-raw-data';

/**
 * 控制返回数据通过 ResponseData 自动包装，默认返回成功的状态
 */
export const RawData = () => SetMetadata(IS_RAW_DATA, true);

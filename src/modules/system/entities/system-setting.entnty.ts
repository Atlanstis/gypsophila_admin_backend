import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Const_SystemSetting, Enum_SettingType } from '../constants';

@Entity({ name: 'system_setting' })
export class SystemSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'key',
    length: Const_SystemSetting.keyMax,
    comment: '标识',
    unique: true,
  })
  key: string;

  @Column({
    name: 'alias',
    length: Const_SystemSetting.aliasMax,
    comment: '别名',
    unique: true,
  })
  alias: string;

  @Column({
    name: 'value',
    length: Const_SystemSetting.valueMax,
    nullable: true,
    comment: '值',
  })
  value: string;

  @Column({
    name: 'description',
    length: Const_SystemSetting.descriptionMax,
    nullable: true,
    comment: '描述',
  })
  description: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: Enum_SettingType,
    default: Enum_SettingType.string,
    comment: '类型',
  })
  type: Enum_SettingType;
}

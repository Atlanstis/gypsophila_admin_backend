import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PLATFORM = 'PS3' | 'PSV' | 'PS4' | 'PS5';

@Entity()
export class PsGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 64,
    comment: '游戏名称',
  })
  name: string;

  @Column({
    name: 'original_name',
    length: 64,
    comment: '游戏原名',
  })
  originalName: string;

  @Column({
    length: 255,
    comment: '缩略图',
  })
  thumbnail: string;

  @Column({
    type: 'simple-array',
    comment: '支持平台',
  })
  platforms: PLATFORM[];

  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date;
}

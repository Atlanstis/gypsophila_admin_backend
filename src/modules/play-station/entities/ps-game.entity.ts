import {
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PsGamePsnine, PsProfileGame, PsTrophyGroup } from 'src/entities';

@Entity({
  name: 'ps_game',
  comment: 'PS 游戏信息',
  orderBy: { updateTime: 'DESC' },
})
export class PsGame implements PlayStation.Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 128,
    comment: '游戏名称',
  })
  name: string;

  @Column({
    name: 'origin_name',
    length: 128,
    comment: '游戏原名',
  })
  originName: string;

  @Column({
    length: 255,
    comment: '缩略图',
  })
  thumbnail: string;

  @Column({
    type: 'simple-array',
    comment: '支持平台',
  })
  platforms: PlayStation.Platform[];

  @Column({
    comment: '白金奖杯数',
  })
  platinum: number;

  @Column({
    comment: '金奖杯数',
  })
  gold: number;

  @Column({
    comment: '银奖杯数',
  })
  silver: number;

  @Column({
    comment: '铜奖杯数',
  })
  bronze: number;

  @OneToOne(() => PsGamePsnine, (psnine) => psnine.game)
  psnine?: PsGamePsnine;

  @OneToMany(() => PsTrophyGroup, (group) => group.game)
  trophyGroups?: PsTrophyGroup[];

  @OneToMany(() => PsProfileGame, (profileGames) => profileGames.game)
  profileGames?: PsProfileGame[];

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @BeforeUpdate()
  updateDates() {
    this.updateTime = new Date();
  }
}

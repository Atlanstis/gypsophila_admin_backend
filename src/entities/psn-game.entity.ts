import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeBase } from './base';
import { PsnGameLink } from './psn-game-link.entity';
import { PsnTrophyGroup } from './psn-trophy-group.entity';
import { PsnProfileGame } from './psn-profile-game.entity';

export type PLATFORM = 'PS3' | 'PSV' | 'PS4' | 'PS5';

@Entity({
  name: 'psn_game',
})
export class PsnGame extends TimeBase {
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
  platforms: PLATFORM[];

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

  @OneToOne(() => PsnGameLink, (link) => link.game)
  link: PsnGameLink;

  @OneToMany(() => PsnTrophyGroup, (group) => group.game)
  trophyGroups: PsnTrophyGroup[];

  @OneToMany(() => PsnProfileGame, (profileGames) => profileGames.game)
  profileGames: PsnProfileGame[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeNotSelectBase } from './base';
import { PsnTrophyGroup } from './psn-trophy-group.entity';
import { PsnTrophyLink } from './psn-trophy-link.entity';
import { PsnProfileGameTrophy } from './psn-profile-game-trophy.entity';

type TrophyType = 'platinum' | 'gold' | 'silver' | 'bronze';

@Entity({ name: 'psn_trophy' })
export class PsnTrophy extends TimeNotSelectBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '顺序' })
  order: number;

  @Column({ comment: '名称', length: 128 })
  name: string;

  @Column({ comment: '描述', length: 128 })
  description: string;

  @Column({ comment: '缩略图', length: 255 })
  thumbnail: string;

  @Column({ comment: '奖杯类型', type: 'enum', enum: ['platinum', 'gold', 'silver', 'bronze'] })
  type: TrophyType;

  @ManyToOne(() => PsnTrophyGroup, (group) => group.trophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'psn_trophy_group_id' })
  group: PsnTrophyGroup;

  @OneToOne(() => PsnTrophyLink, (link) => link.trophy)
  link: PsnTrophyLink;

  @OneToMany(() => PsnProfileGameTrophy, (profileGameTrophies) => profileGameTrophies.trophy)
  profileGameTrophies: PsnProfileGameTrophy[];
}

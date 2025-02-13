import { PsProfileTrophy, PsTrophyGroup } from 'src/entities';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PsTrophyPsnine } from 'src/entities';

const TrophyType: PlayStation.TrophyType[] = [
  'platinum',
  'gold',
  'silver',
  'bronze',
];

@Entity({ name: 'ps_trophy', comment: 'PS 奖杯', orderBy: { order: 'DESC' } })
export class PsTrophy implements PlayStation.Trophy {
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

  @Column({
    comment: '奖杯类型',
    type: 'enum',
    enum: TrophyType,
  })
  type: PlayStation.TrophyType;

  @ManyToOne(() => PsTrophyGroup, (group) => group.trophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group?: PsTrophyGroup;

  @Column({ name: 'group_id' })
  groupId: PsTrophyGroup['id'];

  @OneToOne(() => PsTrophyPsnine, (psnine) => psnine.trophy)
  psnine?: PsTrophyPsnine;

  @OneToMany(() => PsProfileTrophy, (profileTrophies) => profileTrophies.trophy)
  profileTrophies: PsProfileTrophy[];

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

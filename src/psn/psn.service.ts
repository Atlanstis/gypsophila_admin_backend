import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException, CommonPageDto } from 'src/core';
import {
  PsnGame,
  PsnGameLink,
  PsnProfile,
  PsnProfileGame,
  PsnProfileGameTrophy,
  PsnTrophy,
  PsnTrophyGroup,
  PsnTrophyLink,
} from 'src/entities';
import { PsnineTrophy } from 'src/psnine/class';
import { PsnineService } from 'src/psnine/psnine.service';
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm';
import { PsnProfileGameDto } from './dto';

@Injectable()
export class PsnService {
  constructor(
    @InjectRepository(PsnProfile)
    private readonly psnProfileRepository: Repository<PsnProfile>,
    @InjectRepository(PsnGame)
    private readonly psnGameRepository: Repository<PsnGame>,
    @InjectRepository(PsnGameLink)
    private readonly psnGameLinkRepository: Repository<PsnGameLink>,
    @InjectRepository(PsnTrophyGroup)
    private readonly psnTrophyGroupRepository: Repository<PsnTrophyGroup>,
    @InjectRepository(PsnTrophy)
    private readonly psnTrophyRepository: Repository<PsnTrophy>,
    @InjectRepository(PsnTrophyLink)
    private readonly psnTrophyLinkRepository: Repository<PsnTrophyLink>,
    @InjectRepository(PsnProfileGame)
    private readonly psnProfileGameRepository: Repository<PsnProfileGame>,
    @InjectRepository(PsnProfileGameTrophy)
    private readonly psnProfileGameTrophyRepository: Repository<PsnProfileGameTrophy>,
    private readonly psnineService: PsnineService,
    private dataSource: DataSource,
  ) {}

  /** 获取 psn 用户信息 */
  async getProfile(id: string) {
    return await this.findProfileByUserId(id);
  }

  /** 绑定 psn 用户信息 */
  async profileBind(psnId: string, id: string) {
    const existPsnId = await this.psnProfileRepository.findOne({ where: { psnId } });
    if (existPsnId) {
      throw new BusinessException('当前 PsnId 已被绑定');
    }
    let profile = await this.findProfileByUserId(id, { user: true });
    if (profile) {
      profile.psnId = psnId;
    } else {
      const { avatar } = await this.psnineService.getProfileDetail(psnId);
      profile = this.psnProfileRepository.create({ psnId, avatar, user: { id } });
    }
    await this.psnProfileRepository.save(profile);
  }

  /**
   * 根据用户 id 获取 psn 信息
   * @param userId 用户 id
   * @param relations 关联查询条件
   */
  async findProfileByUserId(userId: string, relations: FindOptionsRelations<PsnProfile> = {}) {
    return await this.psnProfileRepository.findOne({
      relations,
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  /**
   * 获取可以同步的游戏列表
   * @param userId 用户 id
   * @param page 页码
   */
  async getGameSynchronizeable(userId: string, page: number) {
    const profile = await this.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    // 获取 psnine 该 psnId 下的游戏
    const pageData = await this.psnineService.getPsnineUserGame(profile.psnId, page);
    // 获取已在系统中同步过的游戏
    const Synchronized = await this.psnProfileGameRepository.find({
      where: { profile: { id: profile.id } },
      relations: {
        game: {
          link: true,
        },
      },
    });
    const SynchronizedIds = Synchronized.map((item) => item.game.link.psnineId);
    // 更改已同步状态
    pageData.list = pageData.list.map((item) => ({
      ...item,
      isSync: SynchronizedIds.includes(item.id),
    }));
    return pageData;
  }

  /** 同步游戏 */
  async gameSync(userId: string, gameId: number) {
    const profile = await this.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    // 使用事务，发生错误时，回滚操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      // 查找数据库是否存在游戏
      let game = await this.psnGameRepository.findOne({ where: { link: { psnineId: gameId } } });
      let profileGame: PsnProfileGame | null = null;
      if (!game) {
        // 不存在，查询游戏信息
        const { name, originName, thumbnail, platforms, url, trophyNum, trophyGroup } =
          await this.psnineService.gameDetail(gameId, profile.psnId);
        // 保存游戏关联数据
        const link = this.psnGameLinkRepository.create({ psnineId: gameId, psnineUrl: url });
        await queryRunner.manager.save(link);
        // 保存游戏数据
        game = this.psnGameRepository.create({
          name,
          originName,
          thumbnail,
          platforms,
          platinum: trophyNum.platinum,
          gold: trophyNum.gold,
          silver: trophyNum.silver,
          bronze: trophyNum.bronze,
          link,
        });
        await queryRunner.manager.save(game);
        // 保存用户游戏同步信息
        profileGame = this.psnProfileGameRepository.create({
          profile,
          game,
        });
        await queryRunner.manager.save(profileGame);
        const map = {
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
        };
        // 遍历保存奖杯组、奖杯信息、用户获得奖杯信息
        for (const groupItem of trophyGroup) {
          const {
            name,
            thumbnail,
            isDLC,
            trophyNum: { platinum, gold, silver, bronze },
            trophies,
          } = groupItem;
          // 保存奖杯组
          const group = this.psnTrophyGroupRepository.create({
            name,
            thumbnail,
            isDLC,
            platinum,
            gold,
            silver,
            bronze,
            game,
          });
          await queryRunner.manager.save(group);
          // 保存奖杯信息，奖杯关联信息，用户获得奖杯信息
          for (const trophyItem of trophies) {
            const { order, name, description, trophyType, id, url, thumbnail, completeTime } =
              trophyItem;
            // 保存奖杯信息
            const psnTrophy = this.psnTrophyRepository.create({
              order,
              name,
              description,
              type: trophyType,
              group,
              thumbnail,
            });
            await queryRunner.manager.save(psnTrophy);
            // 保存奖杯关联信息
            const psnTrophyLink = this.psnTrophyLinkRepository.create({
              psnineTrophyId: id,
              psnineUrl: url,
              trophy: psnTrophy,
            });
            await queryRunner.manager.save(psnTrophyLink);
            // 保存用户获得的奖杯信息
            if (completeTime) {
              const psnProfileGameTrophy = this.psnProfileGameTrophyRepository.create({
                profileGame,
                trophy: psnTrophy,
                completeTime: completeTime ? new Date(completeTime) : null,
              });
              map[psnTrophy.type]++;
              await queryRunner.manager.save(psnProfileGameTrophy);
            }
          }
        }
        // 更新已获得的奖杯数量
        profileGame.platinumGot = map['platinum'];
        profileGame.goldGot = map['gold'];
        profileGame.silverGot = map['silver'];
        profileGame.bronzeGot = map['bronze'];
        await queryRunner.manager.save(profileGame);
      } else {
        // 游戏已存在
        // 查询用户是否已同步该信息
        profileGame = await this.psnProfileGameRepository.findOne({
          where: { profile: { id: profile.id }, game: { id: game.id } },
        });
        // 未同步，创建用户游戏信息
        if (!profileGame) {
          profileGame = this.psnProfileGameRepository.create({
            profile,
            game,
          });
          await queryRunner.manager.save(profileGame);
        }
        // 获取待同步的游戏信息
        const { trophyGroup } = await this.psnineService.gameDetail(gameId, profile.psnId);
        // 记录获得的奖杯数量
        const numMap = {
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
        };
        // psnine 上所有已获得奖杯数据
        const psnineGottedTrophies: PsnineTrophy[] = [];
        const psnineGottedTrophyIds: number[] = [];
        for (const groupItem of trophyGroup) {
          for (const trophyItem of groupItem.trophies) {
            if (trophyItem.completeTime) {
              psnineGottedTrophyIds.push(trophyItem.id);
              psnineGottedTrophies.push(trophyItem);
            }
          }
        }
        // 获取数据库中，相关的奖杯数据
        const existedTrophies = await this.psnTrophyRepository.find({
          relations: { link: true },
          where: {
            link: {
              psnineTrophyId: In(psnineGottedTrophyIds),
            },
          },
        });
        const map: Record<number, PsnTrophy> = {};
        existedTrophies.forEach((item) => {
          map[item.link.psnineTrophyId] = item;
        });
        // 获取数据库中，用户已经同步的奖杯数据
        const profileGameTrophies = await this.psnProfileGameTrophyRepository.find({
          relations: {
            trophy: {
              link: true,
            },
          },
          where: {
            profileGame: {
              id: profileGame.id,
            },
          },
        });
        const profileGameTrophyPsnineIds = profileGameTrophies.map(
          (item) => item.trophy.link.psnineTrophyId,
        );
        // 遍历 psnine 上已经获取的奖杯信息
        const psnProfileGameTrophies: PsnProfileGameTrophy[] = [];
        for (const trophyItem of psnineGottedTrophies) {
          const trophy = map[trophyItem.id];
          // 存在数据库中未同步的DLC的情况，这些奖杯先进行忽略处理
          if (map[trophyItem.id]) {
            numMap[trophy.type]++;
            // 判断该奖杯是否已同步
            const index = profileGameTrophyPsnineIds.indexOf(trophyItem.id);
            if (index > -1) {
              // 该奖杯已经同步，更新完成时间
              const profileGameTrophy = profileGameTrophies[index];
              psnProfileGameTrophies.push(
                this.psnProfileGameTrophyRepository.create({
                  ...profileGameTrophy,
                  completeTime: new Date(trophyItem.completeTime),
                }),
              );
            } else {
              // 奖杯未同步，创建奖杯数据
              psnProfileGameTrophies.push(
                this.psnProfileGameTrophyRepository.create({
                  completeTime: new Date(trophyItem.completeTime),
                  profileGame,
                  trophy,
                }),
              );
            }
          }
        }
        // 保存/更新奖杯信息
        await queryRunner.manager.save(psnProfileGameTrophies);
        // 更新已获得的奖杯数量
        profileGame.platinumGot = numMap['platinum'];
        profileGame.goldGot = numMap['gold'];
        profileGame.silverGot = numMap['silver'];
        profileGame.bronzeGot = numMap['bronze'];
        await queryRunner.manager.save(profileGame);
      }
      // 更改游戏同步时间
      profileGame.syncTime = new Date();
      await queryRunner.manager.save(profileGame);
      // 提交事务
      await queryRunner.commitTransaction();
      // 更新用户获得的奖杯数量
      await this.updateProfileTrophyCount(profile.id, profile);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新用户获得的奖杯数量
   */
  async updateProfileTrophyCount(userId: number, profile: PsnProfile) {
    // 1.查找用户，已同步游戏获得的奖杯数量总和
    const { platinumGot, goldGot, silverGot, bronzeGot } = await this.psnProfileGameRepository
      .createQueryBuilder('ppg')
      .select(
        'SUM(ppg.platinumGot) as platinumGot, SUM(ppg.goldGot) as goldGot, SUM(ppg.silverGot) as silverGot, SUM(ppg.bronzeGot) as bronzeGot',
      )
      .where({ profile: { id: userId } })
      .getRawOne();
    // 2.赋值
    profile.platinum = platinumGot;
    profile.gold = goldGot;
    profile.silver = silverGot;
    profile.bronze = bronzeGot;
    // 3.更新数量
    await this.psnProfileRepository.save(profile);
  }

  /** 获取已经同步的游戏 */
  async gameSynchronized(userId: string, page: number) {
    const size = 12;
    const profile = await this.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    const [list, total] = await this.psnProfileGameRepository.findAndCount({
      relations: {
        game: {
          link: true,
        },
      },
      skip: (page - 1) * size,
      take: size,
      where: { profile: { id: profile.id } },
      order: {
        syncTime: 'DESC',
      },
    });
    return { list, total };
  }

  /**
   * 收藏/取消收藏 游戏
   * @param userId 用户 Id
   * @param ppgId 已收藏游戏 id
   */
  async gameFavor(userId: string, ppgId: PsnProfileGameDto['ppgId']) {
    const profile = await this.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    const psnProfileGame = await this.psnProfileGameRepository.findOne({
      where: { id: ppgId, profile: { id: profile.id } },
    });
    if (!psnProfileGame) {
      throw new BusinessException('该用户未同步此游戏');
    }
    psnProfileGame.isFavor = !psnProfileGame.isFavor;
    psnProfileGame.favorTime = psnProfileGame.isFavor ? new Date() : null;
    await this.psnProfileGameRepository.save(psnProfileGame);
  }

  /** 获取收藏的游戏列表 */
  async gameFavorList(userId: string) {
    const profile = await this.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    return await this.psnProfileGameRepository.find({
      relations: { game: true },
      where: { isFavor: true, profile: { id: profile.id } },
      order: { favorTime: 'DESC' },
    });
  }

  /**
   * 获取游戏列表
   * @param page 分页
   * @param size 每页数量
   */
  async getGameList(page: CommonPageDto['page'], size: CommonPageDto['size']) {
    const [list, total] = await this.psnGameRepository.findAndCount({
      relations: { link: true },
      skip: (page - 1) * size,
      take: size,
      order: {
        updateTime: 'DESC',
      },
    });
    return {
      list,
      total,
    };
  }

  /**
   * 获取用户的游戏信息
   * @param ppgId 游戏id
   * @param userId 用户 id
   */
  async getProfileGame(ppgId: PsnProfileGameDto['ppgId'], userId: string) {
    const profile = await this.findProfileByUserId(userId, { user: true });
    if (!profile) {
      throw new BusinessException('请先绑定 psnId');
    }
    const profileGame = await this.psnProfileGameRepository.findOne({
      where: { id: ppgId, profile: { id: profile.id } },
    });
    if (!profileGame) {
      throw new BusinessException('未找到该游戏');
    }
    // 获取游戏信息
    const game = await this.psnGameRepository.findOne({
      relations: {
        link: true,
      },
      where: { profileGames: { id: profileGame.id } },
    });
    profileGame.game = game;
    // 获取奖杯组信息
    const trophyGroups = await this.psnTrophyGroupRepository.find({
      relations: {
        trophies: {
          link: true,
        },
      },
      where: {
        game: { id: game.id },
      },
      order: {
        trophies: {
          order: 'ASC',
        },
      },
    });
    // 获取已获得的奖杯
    const trophiesGot = await this.psnProfileGameTrophyRepository.find({
      select: { trophy: { id: true } },
      relations: {
        trophy: true,
      },
      where: {
        profileGame: { id: profileGame.id },
      },
    });
    const map: Record<number, PsnProfileGameTrophy> = {};
    trophiesGot.forEach((t) => {
      map[t.trophy.id] = t;
      delete t.trophy;
    });
    trophyGroups.forEach((group) => {
      group.trophies.forEach((trophy) => {
        if (map[trophy.id]) {
          trophy.completeInfo = map[trophy.id];
        }
      });
    });
    game.trophyGroups = trophyGroups;
    return profileGame;
  }
}

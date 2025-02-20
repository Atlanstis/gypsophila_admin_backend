import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PsGame,
  PsGamePsnine,
  PsProfile,
  PsProfileGame,
  PsProfileTrophy,
  PsTrophy,
  PsTrophyGroup,
  PsTrophyPsnine,
} from 'src/entities';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import {
  useTransaction,
  getSkipTake,
  findOneByExistError,
  findOneByNotExistError,
  isValidDate,
} from 'src/utils';
import { PsnineGameIdDto } from './dto';
import { BusinessException } from 'src/core';
import {
  PsnineProfileCrawler,
  PsnineProfileGameListCrawler,
} from '../psnine/crawler';
import { PsnineGameDetailCrawler } from '../psnine/crawler/psnine-game-detail.crawler';

@Injectable()
export class PsProfileService {
  constructor(
    @InjectRepository(PsProfile)
    private readonly psProfileRepo: Repository<PsProfile>,
    @InjectRepository(PsGame)
    private readonly psGameRepo: Repository<PsGame>,
    @InjectRepository(PsGamePsnine)
    private readonly psGamePsnineRepo: Repository<PsGamePsnine>,
    @InjectRepository(PsProfileGame)
    private readonly psProfileGameRepo: Repository<PsProfileGame>,
    @InjectRepository(PsProfileTrophy)
    private readonly psProfileTrophyRepo: Repository<PsProfileTrophy>,
    private readonly dataSource: DataSource,
  ) {}

  /** 用户信息 */
  async getProfileInfo(user: App.JwtPayload): Promise<ResPsProfile.Info> {
    const profile = await this.psProfileRepo.findOne({
      where: {
        userId: user.id,
      },
    });
    return profile;
  }

  /** 用户信息-绑定 */
  async profileBind(psnId: string, user: App.JwtPayload) {
    await findOneByExistError(
      this.dataSource,
      PsProfile,
      [{ psnId }, { userId: user.id }],
      '该 PSN ID 已被绑定或当前用户已绑定 PSN ID',
    );

    const crawler = new PsnineProfileCrawler(psnId);
    await crawler.exec();
    const { error, data } = crawler.getResult();
    if (error) {
      throw new BusinessException(error);
    }
    const profile = this.psProfileRepo.create({
      ...data,
      userId: user.id,
    });
    await this.psProfileRepo.save(profile);
  }

  /** 用户-游戏信息 */
  async getProfileGameInfo(
    profileGameId: number,
    user: App.JwtPayload,
  ): Promise<ResPsProfile.GameInfo> {
    const profile = await this.getProfileByUserId(user.id);
    const profileGame = await this.psProfileGameRepo.findOneBy({
      profileId: profile.psnId,
      id: profileGameId,
    });
    if (!profileGame) {
      throw new BusinessException('当前游戏不存在');
    }
    const game = await this.psGameRepo.findOne({
      where: {
        id: profileGame.gameId,
      },
      relations: {
        psnine: true,
        trophyGroups: {
          trophies: {
            psnine: true,
          },
        },
      },
      order: {
        trophyGroups: {
          trophies: {
            order: 'ASC',
          },
        },
      },
    });
    if (!game) {
      throw new BusinessException('当前游戏不存在');
    }

    let profileTrophies: PsProfileTrophy[] = [];

    if (profileGame) {
      profileTrophies = await this.psProfileTrophyRepo.find({
        where: {
          profileGameId: profileGame?.id,
          profileId: profile.psnId,
        },
      });
    }

    return {
      game,
      profileGame,
      profileTrophies,
    };
  }

  /** 用户-游戏列表 */
  async getProfileGameList(
    page: number,
    size: number,
    user: App.JwtPayload,
  ): Promise<ResPsProfile.GameList> {
    const profile = await this.getProfileByUserId(user.id);
    const { take, skip } = getSkipTake(page, size);
    const [list, total] = await this.psProfileGameRepo.findAndCount({
      take,
      skip,
      where: { profileId: profile.psnId },
      relations: {
        game: {
          psnine: true,
        },
      },
      order: {
        syncTime: 'DESC',
      },
    });
    return { list, total };
  }

  /**
   * 用户-psnine-游戏列表
   * @description 获取用户在 psnine 中的游戏列表 */
  async getProfilePsnineGameList(
    page: number,
    user: App.JwtPayload,
  ): Promise<ResPsProfile.PsnineGameList> {
    const profile = await this.getProfileByUserId(user.id);

    // 从 psnine 上获取用户的游戏列表
    const crawler = new PsnineProfileGameListCrawler(profile.psnId, page);
    await crawler.exec();
    const { error, data } = crawler.getResult();
    if (error) {
      throw new BusinessException(error);
    }
    const { list, total } = data;

    // 根据对应关系，将 psnine 上游戏的 id 转换成系统中的 ps 游戏 id
    const psnineGameIds = list.map((game) => game.id);
    const psGames = await this.psGamePsnineRepo.find({
      where: {
        id: In(psnineGameIds),
      },
      select: {
        id: true,
        gameId: true,
      },
    });
    const psGameIds = psGames.map((game) => game.gameId);

    // 获取用户在系统中已同步的游戏列表
    const profileGameList = await this.psProfileGameRepo.find({
      where: {
        gameId: In(psGameIds),
        profileId: profile.psnId,
      },
      select: {
        gameId: true,
      },
    });

    // 获取用户在系统中已同步的游戏列表对应的 psnine 中游戏的 id
    const SynchronizedPsnineIds = psGames
      .filter((game) => {
        return profileGameList.some(
          (profileGame) => profileGame.gameId === game.gameId,
        );
      })
      .map((game) => game.id);

    return {
      total,
      list: list.map((game) => {
        return {
          ...game,
          isSync: game.id ? SynchronizedPsnineIds.includes(game.id) : false,
        };
      }),
    };
  }

  /** 用户-psnine-游戏-同步 */
  async psnineGameSync(dto: PsnineGameIdDto, user: App.JwtPayload) {
    const profile = await this.getProfileByUserId(user.id);

    const inTransaction = async (manager: EntityManager) => {
      // 根据 PSNINE 游戏 id 获取对应的系统游戏 id
      let psnineGame = await manager.findOne(PsGamePsnine, {
        where: { id: dto.id },
        select: { gameId: true },
      });
      let psGame: Util.Nullable<PsGame> = null;
      if (psnineGame) {
        psGame = await manager.findOne(PsGame, {
          where: { id: psnineGame.gameId },
        });
      }

      // 爬取游戏及奖杯信息
      const crawler = new PsnineGameDetailCrawler(dto.id, profile.psnId);
      await crawler.exec();
      const { error, data } = crawler.getResult();
      if (error) {
        throw new Error(error);
      }
      const { trophyGroups: trophyGroupCrawler, ...gameCrawler } = data;

      // 处理游戏、奖杯组、奖杯信息入库
      if (!psGame) {
        // 未入库
        // 游戏信息入库
        psGame = manager.create(PsGame, {
          name: gameCrawler.name,
          originName: gameCrawler.originName,
          thumbnail: gameCrawler.thumbnail,
          platforms: gameCrawler.platforms,
          platinum: gameCrawler.platinum,
          gold: gameCrawler.gold,
          silver: gameCrawler.silver,
          bronze: gameCrawler.bronze,
        });
        await manager.save(psGame);
        // PSNINE 关联信息入库
        psnineGame = manager.create(PsGamePsnine, {
          id: gameCrawler.id,
          url: gameCrawler.url,
          gameId: psGame.id,
        });
        await manager.save(psnineGame);
        // 批量创建奖杯组实体
        const trophyGroups = trophyGroupCrawler.map((group) => {
          const trophyGroup = manager.create(PsTrophyGroup, {
            name: group.name,
            thumbnail: group.thumbnail,
            platinum: group.platinum,
            gold: group.gold,
            silver: group.silver,
            bronze: group.bronze,
            gameId: psGame?.id,
          });
          return trophyGroup;
        });
        // 批量保存奖杯组
        const savedTrophyGroups = await manager.save(trophyGroups);
        // 储存奖杯及关联信息
        const trophies: PsTrophy[] = [];
        const trophyPsnines: PsTrophyPsnine[] = [];
        // 批量创建奖杯实体和关联信息
        savedTrophyGroups.forEach((group, index) => {
          trophyGroupCrawler[index].trophies?.forEach((trophyCrawler) => {
            // 创建奖杯实体
            const psTrophy = manager.create(PsTrophy, {
              order: trophyCrawler.order,
              name: trophyCrawler.name,
              description: trophyCrawler.description,
              thumbnail: trophyCrawler.thumbnail,
              type: trophyCrawler.type,
              group: group,
            });

            // 创建 PSNINE 关联信息
            const psTrophyPsnine = manager.create(PsTrophyPsnine, {
              id: trophyCrawler.id,
              url: trophyCrawler.url,
            });

            trophies.push(psTrophy);
            trophyPsnines.push(psTrophyPsnine);
          });
        });
        // 批量保存奖杯
        await manager.save(trophies);
        // 关联奖杯与 PSNINE 信息
        trophyPsnines.forEach((psTrophyPsnine, index) => {
          psTrophyPsnine.trophy = trophies[index];
        });
        // 批量保存奖杯关联信息
        await manager.save(trophyPsnines);
      } else {
        // 已入库
        // 根据奖杯组数量判断是否需要更新新奖杯组
        const trophyGroups = await manager.find(PsTrophyGroup, {
          where: { gameId: psGame.id },
          order: {
            id: 'ASC',
          },
        });
        // 数据库中数量少于爬取到的数量，根据新的奖杯组数量创建奖杯组
        if (trophyGroups.length < trophyGroupCrawler.length) {
          // 获取需要新增的奖杯组
          const newTrophyGroups = trophyGroupCrawler.slice(trophyGroups.length);
          // 批量创建新的奖杯组
          const newGroups = newTrophyGroups.map((group) => {
            return manager.create(PsTrophyGroup, {
              name: group.name,
              thumbnail: group.thumbnail,
              platinum: group.platinum,
              gold: group.gold,
              silver: group.silver,
              bronze: group.bronze,
              gameId: psGame?.id,
            });
          });
          // 保存新的奖杯组
          const savedNewGroups = await manager.save(newGroups);
          // 储存奖杯及关联信息
          const trophies: PsTrophy[] = [];
          const trophyPsnines: PsTrophyPsnine[] = [];
          // 为新的奖杯组创建奖杯和关联信息
          savedNewGroups.forEach((group, index) => {
            const groupIndex = trophyGroups.length + index;
            trophyGroupCrawler[groupIndex].trophies?.forEach(
              (trophyCrawler) => {
                // 创建奖杯实体
                const psTrophy = manager.create(PsTrophy, {
                  order: trophyCrawler.order,
                  name: trophyCrawler.name,
                  description: trophyCrawler.description,
                  thumbnail: trophyCrawler.thumbnail,
                  type: trophyCrawler.type,
                  group: group,
                });
                // 创建 PSNINE 关联信息
                const psTrophyPsnine = manager.create(PsTrophyPsnine, {
                  id: trophyCrawler.id,
                  url: trophyCrawler.url,
                });
                trophies.push(psTrophy);
                trophyPsnines.push(psTrophyPsnine);
              },
            );
          });
          // 批量保存奖杯
          await manager.save(trophies);
          // 关联奖杯与 PSNINE 信息
          trophyPsnines.forEach((psTrophyPsnine, index) => {
            psTrophyPsnine.trophy = trophies[index];
          });
          // 批量保存奖杯关联信息
          await manager.save(trophyPsnines);
          // 更新游戏信息中奖杯数量
          await manager.update(
            PsGame,
            { id: psGame.id },
            {
              platinum: gameCrawler.platinum,
              gold: gameCrawler.gold,
              silver: gameCrawler.silver,
              bronze: gameCrawler.bronze,
            },
          );
        }
      }
      // 获取用户游戏数据，不存在
      let profileGame = await manager.findOne(PsProfileGame, {
        where: {
          profileId: profile.psnId,
          gameId: psGame.id,
        },
      });
      // 不存在，则创建
      if (!profileGame) {
        profileGame = manager.create(PsProfileGame, {
          platinumGot: 0,
          goldGot: 0,
          silverGot: 0,
          bronzeGot: 0,
          profileId: profile.psnId,
          gameId: psGame.id,
        });
        await manager.save(profileGame);
      }
      // 过滤出爬取数据中 complete 不为空的奖杯数据
      const trophyComplete = trophyGroupCrawler
        .map((group) => group.trophies)
        .flat()
        .filter((trophy) => !!trophy?.complete);
      // 根据 PSNINE ID 获取系统中的奖杯 ID
      const trophyPsnines = await manager.find(PsTrophyPsnine, {
        where: {
          id: In(trophyComplete.map((trophy) => trophy?.id)),
        },
        select: {
          id: true,
          trophyId: true,
        },
      });
      const psnineToTrophyIdMap = new Map(
        trophyPsnines.map((psnine) => [psnine.id, psnine.trophyId]),
      );

      const trophyIds = trophyPsnines.map((psnine) => psnine.trophyId);
      // 过滤掉库中已完成的奖杯数据，并存入
      const existingTrophies = await manager.find(PsProfileTrophy, {
        where: {
          profileGameId: profileGame.id,
          trophyId: In(trophyIds),
        },
        select: {
          trophyId: true,
        },
      });
      const existingTrophyIds = existingTrophies.map(
        (trophy) => trophy.trophyId,
      );

      // 过滤出新获得的奖杯
      const newTrophyIds = trophyIds.filter(
        (trophyId) => !existingTrophyIds.includes(trophyId),
      );

      if (newTrophyIds.length) {
        // 获取新获得奖杯的详细信息
        const newTrophies = await manager.find(PsTrophy, {
          where: { id: In(newTrophyIds) },
        });
        // 创建用户奖杯记录
        const profileTrophies = newTrophies.map((trophy) => {
          const trophyData = trophyComplete.find((t) => {
            if (!t?.id) return false;
            const crawlerTrophyId = psnineToTrophyIdMap.get(t.id);
            return trophy.id === crawlerTrophyId;
          });
          const completeTime = trophyData?.completeTime;
          const isCompleteTimeValid = isValidDate(completeTime);
          return manager.create(PsProfileTrophy, {
            profileGameId: profileGame?.id,
            trophyId: trophy.id,
            profileId: profile.psnId,
            completeTime: isCompleteTimeValid ? completeTime : undefined,
          });
        });
        // 保存用户奖杯记录
        await manager.save(profileTrophies);
        // 根据爬取数据统计各类型奖杯数量
        const trophyNum = newTrophies.reduce(
          (acc, trophy) => {
            if (!trophy.type) return acc;
            acc[trophy.type] += 1;
            return acc;
          },
          {
            platinum: 0,
            gold: 0,
            silver: 0,
            bronze: 0,
          },
        );
        // 更新用户游戏奖杯数
        await manager.update(PsProfileGame, profileGame.id, {
          platinum: profileGame.platinum + trophyNum.platinum,
          gold: profileGame.gold + trophyNum.gold,
          silver: profileGame.silver + trophyNum.silver,
          bronze: profileGame.bronze + trophyNum.bronze,
        });
        // 更新用户总奖杯数
        await manager.update(PsProfile, profile.psnId, {
          platinum: profile.platinum + trophyNum.platinum,
          gold: profile.gold + trophyNum.gold,
          silver: profile.silver + trophyNum.silver,
          bronze: profile.bronze + trophyNum.bronze,
        });
      }
      // 更新游戏同步时间
      await manager.update(PsProfileGame, profileGame.id, {
        syncTime: new Date(),
      });
    };

    await useTransaction(this.dataSource, inTransaction);
  }

  /** 获取用户对应的 profile 信息 */
  async getProfileByUserId(userId: App.JwtPayload['id']) {
    return await findOneByNotExistError(
      this.dataSource,
      PsProfile,
      { userId },
      '请先绑定 PSN ID',
    );
  }
}

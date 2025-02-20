import * as cheerio from 'cheerio';
import { buildUrl, extractLastIdFromUrl } from 'src/utils';
import { BaseCrawler } from './base-crawler';
import { judgePsnineHtmlError } from '../utils';
import {
  extractUrlAndId,
  extractThumbnail,
  extractOriginName,
  extractVersion,
  extractPlatforms,
  extractPerfectDifficulty,
  extractPerfectRate,
  extractTrophyNum,
  extractName,
  extractTrophyType,
  extractTrophyDescription,
  extractTrophyOrder,
  extractTrophyTipNum,
  extractTrophyCompleteTime,
  extractTrophyCompleteRate,
} from '../utils/extract';

type GameDetailResult = Psnine.GameDetail;

export class PsnineGameDetailCrawler extends BaseCrawler<GameDetailResult> {
  constructor(id: number, psnid?: string) {
    super(buildUrl(`https://psnine.com/psngame/${id}`, { psnid }));
  }

  protected parse($: cheerio.CheerioAPI): GameDetailResult {
    const game = this.extractGameInfo($);
    const trophyGroups = this.extractTrophyGroups($);

    return {
      ...game,
      trophyGroups,
    };
  }

  private extractGameInfo($: cheerio.CheerioAPI) {
    const $mainBox = $('.main .box');
    const $boxFirst = $mainBox.first();
    const $img = $boxFirst.find('img');

    // 获取基本信息
    const thumbnail = extractThumbnail($img);
    const originName = extractOriginName($img);

    // 获取平台和版本信息
    const $next = $img.next();
    const platforms = extractPlatforms($next.children('span'), $);
    const version = extractVersion($next.find('em'));

    // 获取游戏名称
    $next.find('span').remove();
    $next.find('em').remove();
    const name = $next.text();
    const regex = /《(.*?)》/;
    const match = name.match(regex);
    const gameName = match ? match[1] : '';

    // 获取奖杯信息
    const $trophy = $next.next();
    const { platinum, gold, silver, bronze } = extractTrophyNum($trophy);

    // 获取完美难度
    const $perfectDifficulty = $trophy.next();
    const perfectDifficulty = extractPerfectDifficulty($perfectDifficulty);

    // 获取完美率
    const $perfectRate = $perfectDifficulty.next();
    const perfectRate = extractPerfectRate($perfectRate);

    // 提取 URL 和 ID
    const url = this.url.split('?')[0];
    const id = extractLastIdFromUrl(url);

    return {
      id: id || 0,
      url: url,
      thumbnail,
      originName,
      name: gameName,
      version,
      platforms,
      platinum,
      gold,
      silver,
      bronze,
      perfectDifficulty,
      perfectRate,
    };
  }

  private extractTrophyGroups($: cheerio.CheerioAPI): Psnine.TrophyGroup[] {
    const $trophyGroups = $('table.list');
    return $trophyGroups
      .map((i, el) => {
        const trophyGroup: Partial<Psnine.TrophyGroup> = {};
        const $title = $(el).find('tr').first();

        // 设置奖杯组基本信息
        trophyGroup.thumbnail = extractThumbnail($title.find('img'));
        trophyGroup.name = extractName($title.find('p'));
        const { platinum, gold, silver, bronze } = extractTrophyNum(
          $title.find('em'),
        );
        trophyGroup.platinum = platinum;
        trophyGroup.gold = gold;
        trophyGroup.silver = silver;
        trophyGroup.bronze = bronze;

        // 获取奖杯列表
        trophyGroup.trophies = this.extractTrophies($(el), $);

        return trophyGroup as Psnine.TrophyGroup;
      })
      .toArray();
  }

  private extractTrophies(
    $el: cheerio.Cheerio<cheerio.Element>,
    $: cheerio.CheerioAPI,
  ): Psnine.Trophy[] {
    const $trophies = $el.find('tr').slice(1);
    return $trophies
      .map((ti, tEl) => {
        const trophy: Partial<Psnine.Trophy> = {};
        const $children = $(tEl).children();
        let arr: ((
          $: cheerio.CheerioAPI,
          trophy: Partial<Psnine.Trophy>,
          childEl: cheerio.Element,
        ) => void)[] = [];

        if ($children.length === 3) {
          arr = [
            this.trophyDetailTd0Sort,
            this.trophyDetailTd1Sort,
            this.trophyDetailTd3Sort,
          ];
        } else if ($children.length === 4) {
          arr = [
            this.trophyDetailTd0Sort,
            this.trophyDetailTd1Sort,
            this.trophyDetailTd2Sort,
            this.trophyDetailTd3Sort,
          ];
        }
        $children.each(function (ci, childEl) {
          arr[ci]($, trophy, childEl);
        });
        return trophy as Psnine.Trophy;
      })
      .toArray();
  }

  private trophyDetailTd0Sort(
    $: cheerio.CheerioAPI,
    trophy: Partial<Psnine.Trophy>,
    childEl: cheerio.Element,
  ) {
    const type = extractTrophyType(childEl, $);
    const thumbnail = extractThumbnail($(childEl).find('img'));
    const { url, id } = extractUrlAndId($(childEl).find('a'));

    trophy.type = type;
    trophy.thumbnail = thumbnail;
    trophy.url = url;
    if (id) trophy.id = id;
  }

  private trophyDetailTd1Sort(
    $: cheerio.CheerioAPI,
    trophy: Partial<Psnine.Trophy>,
    childEl: cheerio.Element,
  ) {
    trophy.description = extractTrophyDescription(childEl, $);
    trophy.order = extractTrophyOrder(childEl, $);
    trophy.name = extractName($(childEl).find('a'));
    trophy.tipNum = extractTrophyTipNum(childEl, $);
  }

  private trophyDetailTd2Sort(
    $: cheerio.CheerioAPI,
    trophy: Partial<Psnine.Trophy>,
    childEl: cheerio.Element,
  ) {
    const completeTime = extractTrophyCompleteTime(childEl, $);
    if (completeTime) {
      trophy.completeTime = completeTime;
      trophy.complete = true;
    }
  }

  private trophyDetailTd3Sort(
    $: cheerio.CheerioAPI,
    trophy: Partial<Psnine.Trophy>,
    childEl: cheerio.Element,
  ) {
    trophy.completeRate = extractTrophyCompleteRate(childEl, $);
  }

  protected isHtmlError($: cheerio.CheerioAPI) {
    return judgePsnineHtmlError($);
  }
}

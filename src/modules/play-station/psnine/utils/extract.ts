import * as cheerio from 'cheerio';
import { extractLastIdFromUrl, parseToNumber } from 'src/utils';

/** 提取缩略图 */
export function extractThumbnail($el: cheerio.Cheerio<cheerio.Element>) {
  return $el.attr('src') || '';
}

export function extractUrlAndId($el: cheerio.Cheerio<cheerio.Element>) {
  const url = $el.attr('href') || '';
  let id: Util.Nullable<number> = null;
  if (url) {
    id = extractLastIdFromUrl(url);
  }
  return {
    url,
    id,
  };
}

export function extractOriginName($el: cheerio.Cheerio<cheerio.Element>) {
  return $el.attr('alt') || '';
}

export function extractName($el: cheerio.Cheerio<cheerio.Element>) {
  return $el.text() || '';
}

export function extractPerfectDifficulty(
  $el: cheerio.Cheerio<cheerio.Element>,
) {
  return $el.text() as Psnine.PerfectDifficulty;
}

export function extractPerfectRate($el: cheerio.Cheerio<cheerio.Element>) {
  return parseToNumber($el.text().replace('%完美', ''));
}

export function extractPlayers($el: cheerio.Cheerio<cheerio.Element>) {
  return parseToNumber($el.text().replace('人玩过', ''));
}

export function extractProgress($el: cheerio.Cheerio<cheerio.Element>) {
  return parseToNumber($el.text().replace('%', ''));
}

export function extractVersion(
  $el: Util.Nullable<cheerio.Cheerio<cheerio.Element>>,
) {
  return $el
    ? $el
        .text()
        .split('\n')
        .filter((v) => v)
        .map((v) => v.trim())
    : [];
}

export function extractPlatforms(
  $el: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI,
) {
  return $el.toArray().map((el) => $(el).text() as PlayStation.Platform);
}

export function extractTrophyNum(
  $el: cheerio.Cheerio<cheerio.Element>,
): PlayStation.TrophyNum {
  const extractNum = (
    $el: cheerio.Cheerio<cheerio.Element>,
    classNanme: string,
  ) => parseToNumber($el.find(classNanme).text().substring(1));

  return {
    platinum: extractNum($el, '.text-platinum'),
    gold: extractNum($el, '.text-gold'),
    silver: extractNum($el, '.text-silver'),
    bronze: extractNum($el, '.text-bronze'),
  };
}

/** 提取奖杯类型 */
export function extractTrophyType($el: cheerio.Element, $: cheerio.CheerioAPI) {
  const className = $($el).attr('class');
  const map: Record<string, string> = {
    t1: 'platinum',
    t2: 'gold',
    t3: 'silver',
    t4: 'bronze',
  };
  const type = className && map[className];
  return type as PlayStation.TrophyType;
}

/** 提取奖杯描述 */
export function extractTrophyDescription(
  $el: cheerio.Element,
  $: cheerio.CheerioAPI,
) {
  return $($el).children('em').text();
}

/** 提取奖杯顺序 */
export function extractTrophyOrder(
  $el: cheerio.Element,
  $: cheerio.CheerioAPI,
) {
  return Number($($el).find('.h-p').text().substring(1));
}

/** 提取奖杯提示数量 */
export function extractTrophyTipNum(
  $el: cheerio.Element,
  $: cheerio.CheerioAPI,
) {
  const $tipNum = $($el).find('.alert-success');
  if ($tipNum.length > 0) {
    const text = $($el).find('.alert-success').text().replace(' Tips', '');
    return Number(text);
  }
  return 0;
}

/** 提取奖杯完成时间 */
export function extractTrophyCompleteTime(
  $el: cheerio.Element,
  $: cheerio.CheerioAPI,
) {
  const $time = $($el).find('em');
  let completeTime = '';
  if ($time.length) {
    const $year = $time.attr('tips');
    if ($year) {
      const year = $year.slice(0, 4);
      const timeText = $time.text().trim();
      const day = timeText.slice(0, 5);
      const time = timeText.slice(5);
      completeTime = `${year}-${day} ${time}`;
    }
  }
  return completeTime;
}

/** 提取奖杯完成率 */
export function extractTrophyCompleteRate(
  $el: cheerio.Element,
  $: cheerio.CheerioAPI,
) {
  const $clone = $($el).clone();
  $clone.find('em').remove();
  return Number($clone.text().replace('%', ''));
}

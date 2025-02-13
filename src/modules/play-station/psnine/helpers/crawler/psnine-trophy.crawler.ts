import * as cheerio from 'cheerio';
import { extractLastIdFromUrl, isValidDate } from 'src/utils';

export class PsnineTrophyCrawler {
  private trophyCrawler: Psnine.TrophyCrawler;

  constructor() {
    this.trophyCrawler = {};
  }

  /** 设置名称 */
  setName($el: cheerio.Element, $: cheerio.CheerioAPI) {
    this.trophyCrawler.name = $($el).find('a').text();
    return this;
  }

  /** 设置描述 */
  setDescription($el: cheerio.Element, $: cheerio.CheerioAPI) {
    this.trophyCrawler.description = $($el).children('em').text();
    return this;
  }

  /** 设置缩略图 */
  setThumbnail($el: cheerio.Element, $: cheerio.CheerioAPI) {
    this.trophyCrawler.thumbnail = $($el).find('img').attr('src');
    return this;
  }

  /** 设置 url、id */
  setUrlAndId($el: cheerio.Element, $: cheerio.CheerioAPI) {
    const url = $($el).find('a').attr('href');
    if (!url) return this;
    this.trophyCrawler.url = url;
    const id = extractLastIdFromUrl(url);
    if (id) this.trophyCrawler.id = id;
    return this;
  }

  /** 设置顺序 */
  setOrder($el: cheerio.Element, $: cheerio.CheerioAPI) {
    this.trophyCrawler.order = Number($($el).find('.h-p').text().substring(1));
    return this;
  }

  /** 设置提示数量 */
  setTipNum($el: cheerio.Element, $: cheerio.CheerioAPI) {
    const $tipNum = $($el).find('.alert-success');
    let num = 0;
    if ($tipNum.length > 0) {
      const text = $($el).find('.alert-success').text().replace(' Tips', '');
      num = Number(text);
    }
    this.trophyCrawler.tipNum = num;
  }

  /** 设置完成 */
  setComplete(bool: boolean) {
    this.trophyCrawler.complete = bool;
    return this;
  }

  /** 设置完成时间 */
  setCompleteTime($el: cheerio.Element, $: cheerio.CheerioAPI) {
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
      const isCompleteTimeValid = isValidDate(completeTime);
      if (isCompleteTimeValid) {
        this.trophyCrawler.completeTime = completeTime;
      }
      this.setComplete(true);
    }
    return this;
  }

  /**设置奖杯类型 */
  setType($el: cheerio.Element, $: cheerio.CheerioAPI) {
    const className = $($el).attr('class');
    const map: Record<string, string> = {
      t1: 'platinum',
      t2: 'gold',
      t3: 'silver',
      t4: 'bronze',
    };
    const type = className && map[className];
    if (type) {
      this.trophyCrawler.type = type as PlayStation.TrophyType;
    }
    return this;
  }

  /** 设置完成率 */
  setCompleteRate($el: cheerio.Element, $: cheerio.CheerioAPI) {
    $($el).find('em').remove('em');
    const completeRate = Number($($el).text().replace('%', ''));
    this.trophyCrawler.completeRate = completeRate;
    return this;
  }

  build() {
    return this.trophyCrawler;
  }
}

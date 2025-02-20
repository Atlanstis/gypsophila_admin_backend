import * as cheerio from 'cheerio';
import { BaseCrawler } from './base-crawler';
import { judgePsnineHtmlError } from '../utils';

interface ProfileResult {
  psnId: string;
  avatar: string;
}

export class PsnineProfileCrawler extends BaseCrawler<ProfileResult> {
  constructor(psnId: string) {
    super(`https://psnine.com/psnid/${psnId}`);
  }

  protected parse($: cheerio.CheerioAPI): ProfileResult {
    const psnId = this.url.split('/').pop() || '';
    const avatar = $('.psnzz .avabig').attr('src') || '';

    return {
      psnId,
      avatar,
    };
  }

  protected isHtmlError($: cheerio.CheerioAPI) {
    return judgePsnineHtmlError($);
  }
}

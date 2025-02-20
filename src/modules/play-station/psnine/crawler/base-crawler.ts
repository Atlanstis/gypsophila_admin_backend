import * as cheerio from 'cheerio';

export abstract class BaseCrawler<T> {
  protected url: string;
  protected error: string | null = null;
  protected fetchTime: number = 0;
  protected parseTime: number = 0;
  protected fetchHtml: string | null = null;
  protected $: cheerio.CheerioAPI | null = null;
  protected result: T;
  protected isExeced = false;

  constructor(url: string) {
    this.url = url;
  }

  async exec(): Promise<void> {
    try {
      this.isExeced = true;
      const startTime = Date.now();
      const response = await fetch(this.url);
      this.fetchTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`获取网页数据时出错：${response.statusText}`);
      }

      this.fetchHtml = await response.text();
      this.$ = cheerio.load(this.fetchHtml);

      const errorMsg = this.isHtmlError(this.$);
      if (errorMsg) {
        throw new Error(errorMsg);
      }

      const parseStartTime = Date.now();
      this.result = this.parse(this.$);
      this.parseTime = Date.now() - parseStartTime;
    } catch (err) {
      this.error = err instanceof Error ? err.message : '未知错误';
    }
  }

  protected abstract parse($: cheerio.CheerioAPI): T;

  protected abstract isHtmlError($: cheerio.CheerioAPI): string | null;

  getResult() {
    const error = !this.isExeced ? '任务未执行' : this.error;
    return {
      error,
      data: this.result,
    };
  }
}

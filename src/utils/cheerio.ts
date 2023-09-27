import { HttpException } from '@nestjs/common';
import * as cheerio from 'cheerio';

/**
 * 根据 url 获取供 cheerio 的 $
 * @param url url
 * @returns $
 */
export async function getElFromUrl(url: string) {
  let htmlText: string;
  try {
    const res = await fetch(url);
    htmlText = await res.text();
  } catch (e) {
    throw new HttpException('url 请求失败', 500);
  }
  return cheerio.load(htmlText);
}

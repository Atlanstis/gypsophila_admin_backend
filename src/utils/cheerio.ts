import * as cheerio from 'cheerio';
import { BusinessException } from 'src/core';

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
    throw new BusinessException(`请求失败，Url：${url}`);
  }
  return cheerio.load(htmlText);
}

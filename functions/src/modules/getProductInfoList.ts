import {launch, Browser, Page} from "puppeteer";
import {ItemList} from "../types";

const baseUrl = "https://www.amazon.co.jp/hz/wishlist/ls/";

export const getProductInfoList = async (wishListId: string) => {
  const browser = await launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await initPage(browser);
  // 欲しいものリストを開く
  await page.goto(baseUrl + wishListId);
  // スクレイピング
  return await scrapePage(page);
};

const initPage = async (browser: Browser) => {
  return await browser.newPage();
};

const scrapePage = async (page: Page) => {
  const selector = "div[id^='item_']";
  const itemList: ItemList[] = [];
  const list = await page.$$(selector);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const titleSelector = "[id^='itemName_']";
    const titleElement = await item.$(titleSelector);
    const elementIdObj = await titleElement?.getProperty("id");
    const elementId: unknown = await elementIdObj?.jsonValue();
    const id = toString(elementId).split("_")[1];

    const titleObj = await titleElement?.getProperty("textContent");
    const title: unknown = await titleObj?.jsonValue();

    const urlSelector = "[href^='/dp/']";
    const urlElement = await item.$(urlSelector);
    const urlObj = await urlElement?.getProperty("href");
    const url: unknown = await urlObj?.jsonValue();

    const priceSelector = "[id^='itemPrice_'] > span";
    const priceElement = await item.$(priceSelector);
    const priceObj = await priceElement?.getProperty("textContent");
    const price: unknown = await priceObj?.jsonValue();

    const imgSelector = "[id^='itemImage_'] > a > img";
    const imgElement = await item.$(imgSelector);
    const imgObj = await imgElement?.getProperty("src");
    const imgUrl: unknown = await imgObj?.jsonValue();

    itemList.push({
      id: toString(id),
      title: toString(title),
      price: formatPrice(toString(price)),
      url: toString(url),
      imgUrl: toString(imgUrl),
    });
  }
  return itemList;
};

const toString = (value: any): string => {
  return typeof value === "string" ? value : String(value);
};

const toNumber = (value: any): number => {
  return typeof value === "number" ? value : Number(value);
};

const formatPrice = (value: string): number => {
  const price = value.replace(",", "").replace("￥", "");
  return price ? toNumber(price) : -1;
};

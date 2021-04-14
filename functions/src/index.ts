import * as functions from "firebase-functions";
import {getProductInfoList} from "./modules/getProductInfoList";
import {getSaleProductList} from "./modules/getSaleProductList";
import * as admin from "firebase-admin";
import {notifyToLine} from "./modules/notifyToLine";

admin.initializeApp();

const runtimeOptions: functions.RuntimeOptions = {
  memory: "1GB",
};

const REGION = "asia-northeast1";
const TIME_ZONE = "Asia/Tokyo";
const BATCH_SCHEDULE = "0 18 * * *";

/**
 * 欲しいものリストからセール品を取得して通知するAPI
 */
export const notifyWishListSale = functions
  .region(REGION)
  .runWith(runtimeOptions)
  .https
  .onRequest(async (request, response) => {
    const wishListId = functions.config().wish_list.id;
    const itemList = await getProductInfoList(wishListId);

    const saleProductList = await getSaleProductList(itemList);

    await notifyToLine(saleProductList);
    response.send("Success");
  });

/**
 * 1日ごとに欲しいものリストにセール品がないかチェックするバッチ
 */
export const batch = functions.region(REGION)
  .runWith(runtimeOptions)
  .pubsub
  .schedule(BATCH_SCHEDULE)
  .timeZone(TIME_ZONE)
  .onRun(async () => {
    const wishListId = functions.config().wish_list.id;
    const itemList = await getProductInfoList(wishListId);

    const saleProductList = await getSaleProductList(itemList);

    await notifyToLine(saleProductList);

    console.log("Checked Wish List Sale");
  });

import * as functions from "firebase-functions";
import {getProductInfoList} from "./modules/getProductInfoList";
import {getSaleProductList} from "./modules/getSaleProductList";
import * as admin from "firebase-admin";

admin.initializeApp();

export const notifyWishListSale = functions
  .region("asia-northeast1")
  .https
  .onRequest(async (request, response) => {
    // const wishListId = functions.config().wishListId;
    const wishListId = "2ZU1MUB70HWSA";
    const itemList = await getProductInfoList(wishListId);
    console.log(itemList);

    const saleProductList = await getSaleProductList(itemList);
    console.log(saleProductList);

    // firestore updateOrCreate
    // title から取得 なければ 作成
    // あったら priceが小さくなっていたらnotifyに渡す

    // notify line messaging api
    response.status(200).send("Success");
  });


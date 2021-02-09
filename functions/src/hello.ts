import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {getProductInfoList} from "./modules/getProductInfoList";

admin.initializeApp();
export const helloWorld = functions
  .region("asia-northeast1")
  .https
  .onRequest(async (req, res) => {
    const wishListId = "2ZU1MUB70HWsSA";
    const itemList = await getProductInfoList(wishListId);
    console.log(itemList);
    res.send("hello");
  });

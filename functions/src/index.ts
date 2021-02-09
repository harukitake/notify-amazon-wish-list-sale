import * as functions from "firebase-functions";
import {getProductInfoList} from "./modules/getProductInfoList";
import {getSaleProductList} from "./modules/getSaleProductList";
import * as admin from "firebase-admin";
import {notifyToLine} from "./modules/notifyToLine";
import {Client, ClientConfig, TemplateButtons, TemplateMessage} from "@line/bot-sdk";

admin.initializeApp();

const runtimeOptions: functions.RuntimeOptions = {
  memory: "1GB",
};

export const notifyWishListSale = functions
  .region("asia-northeast1")
  .runWith(runtimeOptions)
  .https
  .onRequest(async (request, response) => {
    const wishListId = functions.config().wish_list.id;
    const itemList = await getProductInfoList(wishListId);

    const saleProductList = await getSaleProductList(itemList);

    await notifyToLine(saleProductList);
    response.send("Success");
  });


// export const batch = functions.pubsub
//   .schedule("every 24 hours")
//   .onRun(async () => {
//     const wishListId = functions.config().wishListId;
//     const itemList = await getProductInfoList(wishListId);
//     const saleProductList = await getSaleProductList(itemList);
//     const lineId = functions.config().lineId;
//     await notifyToLine(saleProductList, lineId);
//     console.log("Checked Amazon Wish List");s
//   });

export const testMessage = functions.https.onRequest(async (req, res) => {
  const text = "¥1000";
  const template: TemplateButtons = {
    type: "buttons",
    title: "詳細をみる",
    text: text,
    thumbnailImageUrl: "https://m.media-amazon.com/images/I/51awymrBoRL._SS135_.jpg",
    actions: [
      {
        type: "uri",
        label: "テスト",
        uri: "https://www.amazon.co.jp/dp/B07JJKLZNW/?coliid=IALBBQXSYOGLM&colid=2ZU1MUB70HWSA&psc=0&ref_=lv_vv_lig_dp_it_im",
      },
    ],
  };
  const message: TemplateMessage = {
    type: "template",
    template: template,
    altText: "詳細を見る",
  };
  const config = functions.config().wish_list;
  const lineId = config.line_id;
  const lineConfig: ClientConfig = {
    channelAccessToken: config.line_token,
  };
  const messageList = [message];
  const client = new Client(lineConfig);
  const res2 = await client.pushMessage(lineId, messageList);
  console.log(res2);
  res.end();
});

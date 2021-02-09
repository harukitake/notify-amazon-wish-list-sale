import {ItemList} from "../types";
import * as functions from "firebase-functions";
import {Client, ClientConfig, TemplateButtons, TemplateMessage, TextMessage}
  from "@line/bot-sdk";

export const notifyToLine = async (itemList: ItemList[]) => {
  if (itemList.length === 0) return;
  const config = functions.config().wish_list;
  const lineId = config.line_id;
  const lineConfig: ClientConfig = {
    channelAccessToken: config.line_token,
  };
  const client = new Client(lineConfig);
  const message: TextMessage = {
    type: "text",
    text: "値下げされた商品があります",
  };
  const res = await client.pushMessage(lineId, message);
  console.log(res);

  const messageList: TemplateMessage[] = itemList.map((item: ItemList) => {
    const text = `¥${item.price}`;
    const template: TemplateButtons = {
      type: "buttons",
      title: item.title,
      text: text,
      thumbnailImageUrl: item.imgUrl,
      actions: [
        {
          type: "uri",
          label: "商品の詳細をみる",
          uri: item.url,
        },
      ],
    };
    const message: TemplateMessage = {
      type: "template",
      template: template,
      altText: "詳細を見る",
    };
    return message;
  });

  await client.pushMessage(lineId, messageList).then((res) => console.log(res))
    .catch((error) => {
      console.log(error.originalError.response.data);
    });
};

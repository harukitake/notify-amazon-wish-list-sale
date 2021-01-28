import * as admin from "firebase-admin";
import {ItemList} from "../types";

export const getSaleProductList = async (productList: ItemList[]) => {
  const db = admin.firestore().collection("product");
  const saleProductList = [];
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    const productRef = await db.where("title", "==", product.title)
      .get();
    const productDoc = productRef.docs[0];
    if (!productDoc) {
      // addする
      await db.add({
        title: product.title,
        price: product.price,
        url: product.url,
        imgUrl: product.url,
      });
      continue;
    }
    if (productDoc.data().price > product.price) {
      // update
      saleProductList.push(product);
    }
    await productDoc.ref.update("price", product.price);
  }
  return saleProductList;
};

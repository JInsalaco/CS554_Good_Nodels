const { weddings, gifts } = require("../config/mongoCollections");
const Mock = require("mockjs");
const { gifts: giftData, weddings: weddingData } = require("../data");

const getAllGifts = async () => await giftData.getAll();
const getAllWeddings = async () => await weddingData.getAll();
const loadDefaultGifts = async () => {
  const giftCollection = await gifts();

  let giftList = [];
  for (let i = 0; i < 10; i++) {
    giftList.push(
      Mock.mock({
        title: "@title",
        "price|25-150.0-2": 100,
        url: "@url",
        picture: "@image",
        description: "@paragraph",
      })
    );
  }

  const insertInfo = await giftCollection.insertMany(giftList);
  if (insertInfo.insertedCount === 0) throw "Could not add default weddings";
};

const loadDefaultWeddings = async (weddingList) => {
  const weddingCollection = await weddings();
  const giftCollection = await getAllGifts();
  //Change once routes are made to getAllGifts
  const Random = Mock.Random;
  Random.extend({
    giftId(data) {
      const list = giftCollection.map((item) => item._id);
      return this.pick(list);
    },
  });

  for (let item of weddingList) {
    console.log("Wedding List" + item);
    let giftData = Mock.mock({
      "gifts|0-14": ["@GIFTID"],
    });
    console.log("Gifts" + giftData.gifts);
    item.gifts = giftData.gifts;
    console.log("Gifts" + item.gifts);
  }
  const insertInfo = await weddingCollection.insertMany(weddingList);
  if (insertInfo.insertedCount === 0) throw "Could not add default weddings";
};

module.exports = {
  loadDefaultGifts,
  loadDefaultWeddings,
};

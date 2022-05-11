require("dotenv").config();
const dbConnection = require("../config/mongoConnection");
const weddingList = require("./weddings.json");
const { loadDefaultWeddings, loadDefaultGifts } = require("./func");
const { gifts: giftData, weddings: weddingData } = require("../data");
const { ObjectId } = require("mongodb");

const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

async function main() {
  client.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
  });
  const db = await dbConnection();

  const mixer = await giftData.create(
    "Kitchen-Aid Stand Mixer",
    429,
    "https://www.amazon.com/KitchenAid-KSM150PSAQ-Artisan-Pouring-Shield/dp/B005PMEHBG/ref=sr_1_3?keywords=kitchenaid+stand+mixer+5+quart&qid=1648777476&sprefix=kitchen+aid+s%2Caps%2C106&sr=8-3",
    "/public/img/noimg.jpg",
    "Beautiful stand mixer for the bride and groom"
  );

  const toaster = await giftData.create(
    "Toaster Oven",
    47,
    "https://www.amazon.com/BLACK-DECKER-Convection-Stainless-TO1760SS/dp/B0721CGB5F/ref=sr_1_3?crid=11AGQP2DTZ6YA&keywords=toaster+oven&qid=1648777611&sprefix=toaster+oven%2Caps%2C74&sr=8-3",
    "/public/img/noimg.jpg",
    "Wonderful toaster oven for carb eating"
  );

  const champagne = await giftData.create(
    "Champagne Flutes",
    22,
    "https://www.amazon.com/JoyJolt-Stemless-Champagne-Glasses-Glassware/dp/B08BBHLW3Q/ref=sr_1_4?crid=331R3NNWMZ8JT&keywords=champagne+glasses&nav_sdd=aps&qid=1648777655&refinements=p_n_feature_eight_browse-bin%3A17941671011&rnid=17941669011&s=kitchen&sprefix=champagne+glass&sr=1-4",
    "/public/img/noimg.jpg",
    "Crystal stemless champagne flutes for our honeymoon"
  );

  const wedding1 = await weddingData.create({
    venue: "Medieval Times",
    title: "Jake and Amy's Wedding",
    events: [],
    date: {
      day: 30,
      month: "June",
      year: 2023,
    },
    contactPerson: "cszablewskipaz@gmail.com",
    rsvpDeadline: {
      day: 1,
      month: "May",
      year: 2023,
    },
  });
  await weddingData.addEvent(
    wedding1._id,
    "Bachelor Party",
    {
      day: 1,
      month: "May",
      year: 2023,
    },
    "Bachelor Party before the wedding"
  );
  await weddingData.addEvent(
    wedding1._id,
    "Bachellorette Party",
    {
      day: 1,
      month: "May",
      year: 2023,
    },
    "Last night was a movie!"
  );
  await weddingData.addAttendee(
    wedding1._id,
    "Joseph Insalaco",
    "jinsalac@stevens.edu",
    true,
    2,
    ["chicken", "steak", "fish"]
  );
  await weddingData.addAttendee(
    wedding1._id,
    "Timothy Wang",
    "twang77@stevens.edu",
    false,
    0,
    []
  );
  await weddingData.addImage(
    wedding1._id,
    "https://images.unsplash.com/photo-1622977266039-dbb162254c12?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8aW1nfHx8fHx8MTY0OTI3MDk5OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800",
    ObjectId()
  );

  await weddingData.addGift(wedding1._id, mixer._id);
  await weddingData.addGift(wedding1._id, champagne._id);

  const wedding2 = await weddingData.create({
    venue: "Nanina's In the Park",
    title: "Elizabeth and Billy's Wedding",
    events: [],
    date: {
      day: 10,
      month: "August",
      year: 2023,
    },
    contactPerson: "eholmes@thernos.org",
    rsvpDeadline: {
      day: 1,
      month: "July",
      year: 2022,
    },
  });

  await weddingData.addEvent(
    wedding2._id,
    "Rehearsal Dinner",
    {
      day: 1,
      month: "August",
      year: 2023,
    },
    "Please be prompt"
  );
  await weddingData.addEvent(
    wedding2._id,
    "Post-Wedding Blood Test Brunch",
    {
      day: 20,
      month: "August",
      year: 2023,
    },
    "Theranos sponsored blood tests!"
  );

  const christian = await weddingData.addAttendee(
    wedding2._id,
    "Christian Paz",
    "cszablew@stevens.edu",
    true,
    1,
    ["steak", "vegetarian"]
  );
  const anisha = await weddingData.addAttendee(
    wedding2._id,
    "Anisha Shin",
    "ashin1@stevens.edu",
    false,
    0,
    []
  );
  const jacob = await weddingData.addAttendee(
    wedding2._id,
    "Jacob Roessler",
    "jroessl1@stevens.edu",
    true,
    0,
    ["steak"]
  );

  await weddingData.addImage(
    wedding2._id,
    "https://images.unsplash.com/photo-1622977266039-dbb162254c12?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8aW1nfHx8fHx8MTY0OTI3MDk5OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800",
    ObjectId()
  );
  await weddingData.addGift(wedding2._id, mixer._id);
  await weddingData.addGift(wedding2._id, toaster._id);

  /**
   * close DB connection
   */
  console.log("Done seeding database");
  await db.serverConfig.close();
}

main().catch(console.log);

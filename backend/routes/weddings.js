const express = require("express");
const { EventEmitter } = require("mongodb/lib/apm");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const giftData = data.gifts;
const weddingData = data.weddings;
const s3 = require("../data/s3");
const ses = require("../data/ses");
const checker = require("../data/checker");
const { ObjectId } = require("mongodb");
const { exist } = require("mongodb/lib/gridfs/grid_store");
const { getByAttendee } = require("../data/weddings");
const gm = require("gm").subClass({ imageMagick: true });

const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const addWeddingToRedisDB = async ({ wedding, db, name }) => {
  let _db = JSON.parse(db);
  if (!_db?.length > 0) {
    _db = [];
  }
  // add post to array
  _db.push(wedding);
  await client.setAsync(name, JSON.stringify(_db));
};

const updateWeddingInRedisDB = async ({ wedding, db, name }) => {
  const _db = JSON.parse(db);
  const index = _db.findIndex(
    (w) => w._id.toString() === wedding._id.toString()
  );
  _db[index] = wedding;
  await client.setAsync(name, JSON.stringify(_db));
};

const removeWeddingInRedisDB = async ({ wedding, db, name }) => {
  const _db = JSON.parse(db);
  const index = _db.findIndex(
    (w) => w._id.toString() === wedding._id.toString()
  );
  _db.splice(index, 1);
  await client.setAsync(name, JSON.stringify(_db));
};

// GET localhost:3001/weddings
// Returns all weddings from the weddings collection
// May or may not be used
router.get("/", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let parsedWeddings = JSON.parse(weddings);
  if (parsedWeddings?.length > 0) {
    res.status(200).json(parsedWeddings);
    return;
  }
  let allWeddings;
  try {
    allWeddings = await weddingData.getAll();
  } catch (e) {
    res.status(500).json({
      message: `Could not fetch all weddings! ${e}`,
    });
    return;
  }
  res.json(allWeddings);
});

// GET localhost:3001/weddings/:weddingId
// Returns the inputted wedding ID from the weddings collection
router.get("/:weddingId", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let parsedWeddings = JSON.parse(weddings);
  if (parsedWeddings?.length > 0) {
    if (parsedWeddings.find((w) => w._id === req.params.weddingId)) {
      res
        .status(200)
        .json(parsedWeddings.find((w) => w._id === req.params.weddingId));
      return;
    }
  } else {
    parsedWeddings = [];
  }

  let reqWedding;
  if (!req.params.weddingId) {
    res.status(400).json({ message: "You must pass in a weddingId!" });
    return;
  }
  try {
    reqWedding = await weddingData.get(req.params.weddingId);
    await addWeddingToRedisDB({
      wedding: reqWedding,
      db: weddings,
      name: "weddings",
    });
  } catch (e) {
    res.status(400).json({ message: e });
    return;
  }
  if (!reqWedding) {
    res.status(404).json({
      message: `Could not find wedding Id: ${req.params.weddingId}`,
    });
    return;
  }

  res.json(reqWedding);
});

router.get("/wedding/:email", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let parsedWeddings = JSON.parse(weddings);
  if (parsedWeddings?.length > 0) {
    if (parsedWeddings.find((w) => w.contactPerson === req.params.email)) {
      res
        .status(200)
        .json(parsedWeddings.find((w) => w.contactPerson === req.params.email));
      return;
    }
  } else {
    parsedWeddings = [];
  }

  let reqWedding;
  if (!req.params.email) {
    res.status(400).json({ message: "You must pass in an email!" });
    return;
  }
  try {
    reqWedding = await weddingData.getByContactPerson(xss(req.params.email));
    await addWeddingToRedisDB({
      wedding: reqWedding,
      db: weddings,
      name: "weddings",
    });
  } catch (e) {
    res.status(400).json({ message: e });
    return;
  }
  if (!reqWedding) {
    res.status(404).json({
      message: `Could not find wedding Id: ${req.params.email}`,
    });
    return;
  }
  res.json(reqWedding);
});

router.get("/attending/:email", async (req, res) => {
  let attendingWeddings;
  try {
    attendingWeddings = await getByAttendee(xss(req.params.email));
  } catch (e) {
    res.status(500).json({
      message: `Could not fetch your weddings! ${e}`,
    });
    return;
  }
  res.json(attendingWeddings);
});
// GET localhost:3001/user/:userId
// Gets all weddings associated with userId
router.get("/user/:userId", async (req, res) => {
  let userWeddings;
  if (!req.params.userId) {
    res.status(400).json({ message: "You must pass in a userId!" });
    return;
  }
  try {
    userWeddings = await weddingData.getAllUser(xss(req.params.userId));
  } catch (e) {
    res.status(400).json({ message: e });
    return;
  }
  if (!userWeddings) {
    res.status(404).json({
      message: `Could not find weddings for userId: ${req.params.userId}`,
    });
    return;
  }
  res.json(userWeddings);
});

router.delete("/:id", async (req, res) => {
  let wedding;
  req.params.id = xss(req.params.id);
  if (!req.params.id) {
    res.status(400).json({ message: "You must pass in a wedding id!" });
  }
  try {
    wedding = await weddingData.get(xss(req.params.id));
  } catch (e) {
    res.status(400).json({ message: e });
    return;
  }
  if (!wedding) {
    res.status(404).json({
      message: `Could not find wedding Id: ${req.params.id}`,
    });
    return;
  }

  //If the wedding has images from s3 make sure to delete them
  for (let image of wedding.images) {
    if (image.url.includes("weddio.s3")) {
      s3.deleteFile(image._id);
    }
  }

  try {
    await weddingData.remove(xss(req.params.id));
    const weddings = await client.getAsync("weddings");
    let parsedWeddings = JSON.parse(weddings);
    await removeWeddingInRedisDB({
      wedding: parsedWeddings.find(
        (w) => w._id.toString() === xss(req.params.id)
      ),
      db: weddings,
      name: "weddings",
    });
  } catch (e) {
    res.status(500).json({ message: `Error deleting wedding: ${e}` });
    return;
  }
  res.sendStatus(200);
});

router.patch("/:id/attendee", async (req, res) => {
  req.params.id = xss(req.params.id);
  const weddings = await client.getAsync("weddings");
  if (
    !req.params.id ||
    typeof req.params.id !== "string" ||
    req.params.id.trim() === ""
  ) {
    res.status(400).json({
      message:
        "Id must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  if (!req.body) {
    res.status(400).json({
      message: "You must provide data to edit an attendee.",
    });
    return;
  }
  let { name, email, attending, extras, foodChoices } = req.body;
  if (!name || typeof name !== "string" || name.trim() === "") {
    res.status(400).json({
      message:
        "Id must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    res.status(400).json({
      message:
        "email must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  if (typeof attending !== "boolean") {
    res.status(400).json({
      message: "attending must be a boolean.",
    });
    return;
  }

  if (!Number.isInteger(extras)) {
    res.status(400).json({
      message: "extras must be a number",
    });
    return;
  }

  if (!foodChoices || !Array.isArray(foodChoices)) {
    res.status(400).json({
      message: "food choice must be an array",
    });
    return;
  }
  let sesEmail = [email];
  try {
    const newWedding = await weddingData.addAttendee(
      req.params.id,
      xss(name),
      xss(email),
      attending,
      extras,
      foodChoices
    );
    await updateWeddingInRedisDB({
      wedding: newWedding,
      db: weddings,
      name: "weddings",
    });
    ses.sendEmail(sesEmail, newWedding.title);
    res.status(200).json(newWedding);
  } catch (e) {
    res.status(500).json({
      message: `Could not add attendee! ${e}`,
    });
    return;
  }
});

//Remove an attendee from a wedding
router.delete("/:id/attendee/:attendeeId", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let existingAttendee;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.attendeeId);
    req.params.id = xss(req.params.id);
    req.params.attendeeId = xss(req.params.attendeeId);
    // Check that the event actually exists
    let reqWedding = await weddingData.get(req.params.id);
    for (let attendee of reqWedding.attendees) {
      if (String(attendee._id) === req.params.attendeeId) {
        existingAttendee = attendee;
        break;
      }
    }
    await updateWeddingInRedisDB({
      wedding: reqWedding,
      db: weddings,
      name: "weddings",
    });
    if (!existingAttendee) throw `Attendee not found!`;
  } catch (e) {
    res.status(400).json({
      message: `Error in deleting attendee, ${e}`,
    });
    return;
  }
  // Perform the delete
  try {
    const updatedWedding = await weddingData.removeAttendee(
      req.params.id,
      req.params.attendeeId
    );
    res.json(updatedWedding);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

router.patch("/:id/event", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  req.params.id = xss(req.params.id);
  if (
    !req.params.id ||
    typeof req.params.id !== "string" ||
    req.params.id.trim() === ""
  ) {
    res.status(400).json({
      message:
        "Id must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  if (!req.body) {
    res.status(400).json({
      message: "You must provide data to edit an attendee.",
    });
    return;
  }
  let { title, date, description } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    res.status(400).json({
      message:
        "title must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  if (!date || typeof date !== "object") {
    res.status(400).json({
      message: "date must be an object.",
    });
    return;
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    res.status(400).json({
      message:
        "decription must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  try {
    const newWedding = await weddingData.addEvent(
      req.params.id,
      xss(title),
      date,
      xss(description)
    );
    await updateWeddingInRedisDB({
      wedding: newWedding,
      db: weddings,
      name: "weddings",
    });
    res.status(200).json(newWedding);
  } catch (e) {
    res.status(500).json({
      message: `Could not add event! ${e}`,
    });
    return;
  }
});

router.patch("/:id/gift", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  req.params.id = xss(req.params.id);
  if (
    !req.params.id ||
    typeof req.params.id !== "string" ||
    req.params.id.trim() === ""
  ) {
    res.status(400).json({
      message:
        "Id must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  if (!req.body) {
    res.status(400).json({
      message: "You must provide data to edit an attendee.",
    });
    return;
  }
  let { giftId } = req.body;

  if (!giftId || typeof giftId !== "string" || giftId.trim() === "") {
    res.status(400).json({
      message:
        "giftId must be a non-empty string containing more than just spaces.",
    });
    return;
  }

  let newWedding;
  try {
    newWedding = await weddingData.addGift(req.params.id, giftId);
    await updateWeddingInRedisDB({
      wedding: newWedding,
      db: weddings,
      name: "weddings",
    });
    res.status(200).json(newWedding);
  } catch (e) {
    res.status(500).json({
      message: `Could not add gift! ${e}`,
    });
    return;
  }
});
// POST localhost:3001/weddings/
// Route to create new wedding
router.post("/", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let { venue, title, events, date, contactPerson, rsvpDeadline } = req.body;
  venue = xss(venue);
  title = xss(title);
  events = [];
  date.month = xss(date.month);
  date.day = xss(date.day);
  date.year = xss(date.year);
  contactPerson = xss(contactPerson);
  rsvpDeadline.month = xss(rsvpDeadline.month);
  rsvpDeadline.day = xss(rsvpDeadline.day);
  rsvpDeadline.year = xss(rsvpDeadline.year);
  const newWedding = {
    venue,
    title,
    events,
    date,
    contactPerson,
    rsvpDeadline,
  };
  if (!venue || !title || !events || !date || !contactPerson || !rsvpDeadline) {
    res.status(400).send({ error: "You must provide all the required fields" });
    return;
  }
  try {
    const returnedWedding = await weddingData.create(newWedding);
    await addWeddingToRedisDB({
      wedding: returnedWedding,
      db: weddings,
      name: "weddings",
    });

    res.status(200).send(returnedWedding);
  } catch (e) {
    res.status(500).send({ error: e });
    console.log(e);
  }
});

router.put("/:id", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  const { id } = req.params;
  let newWedding = { weddingId: id };
  if (req.body.venue) {
    const venue = xss(req.body.venue);
    newWedding = { ...newWedding, venue };
  }
  if (req.body.title) {
    const title = xss(req.body.title);
    newWedding = { ...newWedding, title };
  }
  if (req.body.events) {
    const events = xss(req.body.events);
    newWedding = { ...newWedding, events };
  }
  if (req.body.date) {
    const date = req.body.date;
    date.month = xss(date.month);
    date.day = xss(date.day);
    date.year = xss(date.year);
    newWedding = { ...newWedding, date };
  }
  if (req.body.contactPerson) {
    const contactPerson = req.body.contactPerson;
    newWedding = { ...newWedding, contactPerson };
  }
  if (req.body.rsvpDeadline) {
    const rsvpDeadline = req.body.rsvpDeadline;
    rsvpDeadline.month = xss(rsvpDeadline.month);
    rsvpDeadline.day = xss(rsvpDeadline.day);
    rsvpDeadline.year = xss(rsvpDeadline.year);
    newWedding = { ...newWedding, rsvpDeadline };
  }

  if (!id) {
    res.status(400).send({ error: "You must provide an id" });
    return;
  }
  try {
    const returnedWedding = await weddingData.updateWedding(newWedding);
    await updateWeddingInRedisDB({
      wedding: returnedWedding,
      db: weddings,
      name: "weddings",
    });
    res.status(200).send(returnedWedding);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// PATCH localhost:3001/weddings/:id/event/:eventId
// Route to edit an event within the inputted wedding
router.patch("/:id/event/:eventId", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let eventInfo = req.body;
  let existingEvent;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.eventId);
    req.params.id = xss(req.params.id);
    req.params.eventId = xss(req.params.eventId);
    if (eventInfo.title) {
      checker.checkStr(eventInfo.title);
    }
    if (eventInfo.date) {
      weddingData.dateValidation(eventInfo.date);
    }
    if (eventInfo.description) {
      checker.checkStr(eventInfo.description);
    }
    if (!eventInfo.title && !eventInfo.date && !eventInfo.description) {
      throw "Nothing to edit in edit event route!";
    }
    // Check that the event actually exists
    let reqWedding = await weddingData.get(req.params.id);
    for (let event of reqWedding.events) {
      if (String(event._id) === req.params.eventId) {
        existingEvent = event;
        break;
      }
    }
    if (!existingEvent) throw `Event not found!`;
  } catch (e) {
    res.status(400).json({
      message: `Error in patch event, ${e}`,
    });
    return;
  }
  // Fill in everything that wasn't passed in
  if (!eventInfo.title) eventInfo.title = existingEvent.title;
  if (!eventInfo.date) eventInfo.date = existingEvent.date;
  if (!eventInfo.description) eventInfo.description = existingEvent.description;
  eventInfo._id = ObjectId(req.params.eventId);
  try {
    const updatedWedding = await weddingData.editEvent(
      req.params.id,
      req.params.eventId,
      eventInfo
    );
    await updateWeddingInRedisDB({
      wedding: updatedWedding,
      db: weddings,
      name: "weddings",
    });
    res.json(updatedWedding);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

// DELETE localhost:30001/weddings/:id/event/:eventId
// Route to delete an associated event for a wedding
router.delete("/:id/event/:eventId", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let existingEvent;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.eventId);
    req.params.id = xss(req.params.id);
    req.params.eventId = xss(req.params.eventId);
    // Check that the event actually exists
    let reqWedding = await weddingData.get(req.params.id);
    for (let event of reqWedding.events) {
      if (String(event._id) === req.params.eventId) {
        existingEvent = event;
        break;
      }
    }
    if (!existingEvent) throw `Event not found!`;
  } catch (e) {
    res.status(400).json({
      message: `Error in deleting event, ${e}`,
    });
    return;
  }
  // Perform the delete
  try {
    const updatedWedding = await weddingData.deleteEvent(
      req.params.id,
      req.params.eventId
    );
    await updateWeddingInRedisDB({
      wedding: updatedWedding,
      db: weddings,
      name: "weddings",
    });
    res.json(updatedWedding);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

// PATCH localhost:3001/weddings/:id/attendee/:attendeeId
// Route to edit an attendee within the inputted wedding
router.patch("/:id/attendee/:attendeeId", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let attendInfo = req.body;
  let existingAttend;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.attendeeId);
    req.params.id = xss(req.params.id);
    req.params.attendeeId = xss(req.params.attendeeId);
    if (attendInfo.name) {
      checker.checkStr(attendInfo.name);
    }
    if (attendInfo.email) {
      weddingData.emailValidation(attendInfo.email);
    }
    if (attendInfo.extras) {
      checker.checkID(attendInfo.extras);
    }
    if (attendInfo.foodChoices) {
      for (let food of attendInfo.foodChoices) checker.checkStr(food);
    }
    if (
      !attendInfo.name &&
      !attendInfo.email &&
      !attendInfo.attending &&
      !attendInfo.extras &&
      !attendInfo.foodChoices
    ) {
      throw "Nothing to edit in edit attendee route!";
    }
    // Check that the attendee actually exists
    let reqWedding = await weddingData.get(req.params.id);
    for (let attendee of reqWedding.attendees) {
      if (String(attendee._id) === req.params.attendeeId) {
        existingAttend = attendee;
        break;
      }
    }
    if (!existingAttend) throw `Attendee not found!`;
  } catch (e) {
    res.status(400).json({
      message: `Error in patch attendee, ${e}`,
    });
    return;
  }
  // Fill in everything that wasn't passed in
  if (!attendInfo.name) attendInfo.name = existingAttend.name;
  if (!attendInfo.email) attendInfo.email = existingAttend.email;
  if (!("attending" in attendInfo))
    attendInfo.attending = existingAttend.attending;
  if (!attendInfo.extras) attendInfo.extras = existingAttend.extras;
  if (!attendInfo.foodChoices)
    attendInfo.foodChoices = existingAttend.foodChoices;
  attendInfo._id = ObjectId(req.params.attendeeId);
  try {
    const updatedWedding = await weddingData.editAttendee(
      req.params.id,
      req.params.attendeeId,
      attendInfo
    );
    await updateWeddingInRedisDB({
      wedding: updatedWedding,
      db: weddings,
      name: "weddings",
    });
    res.json(updatedWedding);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

// PATCH localhost:3001/weddings/:id/image/:imageId
// Route to edit an image within the inputted wedding
router.patch("/:id/image/:imageId", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let imageInfo = req.body;
  let existingImage;
  let isAWS = false;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.imageId);
    req.params.id = xss(req.params.id);
    req.params.imageId = xss(req.params.imageId);
    if (imageInfo.url) {
      checker.checkStr(imageInfo.url);
    }
    if (!imageInfo.url && !imageInfo.imageBinary) {
      throw "Nothing to edit in edit image route!";
    }
    // Check that the image actually exists
    let reqWedding = await weddingData.get(req.params.id);
    for (let image of reqWedding.images) {
      if (String(image._id) === req.params.imageId) {
        if (image.url.includes("weddio.s3")) {
          isAWS = true;
        }
        existingImage = image;
        break;
      }
    }
    if (!existingImage) throw `Image not found!`;
  } catch (e) {
    res.status(400).json({
      message: `Error in patch image, ${e}`,
    });
    return;
  }
  // Fill in everything that wasn't passed in
  imageInfo._id = ObjectId(req.params.imageId);
  try {
    // If the image is in S3, we need to delete the S3 object and recreate it
    if (isAWS) {
      s3.deleteFile(req.params.imageId);
    }
    if (imageInfo.imageBinary) {
      var buf = Buffer.from(
        req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      // IMAGEMAGICK CODE to resize
      gm(buf).identify(function (err, _) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
      });
      gm(buf).resize(960, 960);
      let s3Data = {
        Bucket: "weddio-images",
        Key: req.params.imageId,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      };
      s3.uploadImageBinary(s3Data);
      // Then we need to add it into the MongoDB with the link
      const baseURL = "https://weddio-images.s3.amazonaws.com";
      const updatedWedding = await weddingData.editImage(
        req.params.id,
        req.params.imageId,
        {
          _id: ObjectId(req.params.imageId),
          url: `${baseURL}/${req.params.imageId}`,
        }
      );
      await updateWeddingInRedisDB({
        wedding: updatedWedding,
        db: weddings,
        name: "weddings",
      });
      res.json(updatedWedding);
    } else {
      const updatedWedding = await weddingData.editImage(
        req.params.id,
        req.params.imageId,
        imageInfo
      );
      await updateWeddingInRedisDB({
        wedding: updatedWedding,
        db: weddings,
        name: "weddings",
      });
      res.json(updatedWedding);
    }
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

// PUT localhost:3001/weddings/:id/image
// Route to add an image to a wedding
router.put("/:id/image", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let imageInfo = req.body;
  // Error check
  let reqWedding;
  try {
    req.params.id = xss(req.params.id);
    reqWedding = await weddingData.get(req.params.id);
    if (!reqWedding) throw `Wedding not found!`;
    if (imageInfo.url) {
      checker.checkStr(imageInfo.url);
    }
  } catch (e) {
    res.status(400).json({
      message: `Error in adding image, ${e}`,
    });
    return;
  }
  // Perform the add
  try {
    // Create new ObjectId for the image
    let newID = ObjectId();
    // Add image into AWS first
    if (req.body.imageBinary) {
      var buf = Buffer.from(
        req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      // IMAGEMAGICK CODE to resize
      gm(buf).identify(function (err, value) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
      });
      gm(buf).resize(960, 960);
      let s3Data = {
        Bucket: "weddio-images",
        Key: String(newID),
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      };
      s3.uploadImageBinary(s3Data);
      // Then we need to add it into the MongoDB with the link
      const baseURL = "https://weddio-images.s3.amazonaws.com";
      const updatedWedding = await weddingData.addImage(
        req.params.id,
        `${baseURL}/${String(newID)}`,
        newID
      );
      await updateWeddingInRedisDB({
        wedding: updatedWedding,
        db: weddings,
        name: "weddings",
      });
      res.json(updatedWedding);
    } else {
      const updatedWedding = await weddingData.addImage(
        req.params.id,
        imageInfo.url,
        newID
      );
      await updateWeddingInRedisDB({
        wedding: updatedWedding,
        db: weddings,
        name: "weddings",
      });
      res.json(updatedWedding);
    }
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

// DELETE localhost:30001/weddings/:id/image/:imageId
// Route to delete an image for a wedding
router.delete("/:id/image/:imageId", async (req, res) => {
  const weddings = await client.getAsync("weddings");
  let existingImage;
  let isAWS = false;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.imageId);
    req.params.id = xss(req.params.id);
    req.params.imageId = xss(req.params.imageId);
    // Check that the image actually exists
    let reqWedding = await weddingData.get(req.params.id);
    for (let image of reqWedding.images) {
      if (String(image._id) === req.params.imageId) {
        if (image.url.includes("weddio.s3")) {
          isAWS = true;
        }
        existingImage = image;
        break;
      }
    }
    if (!existingImage) throw `Image not found!`;
  } catch (e) {
    res.status(400).json({
      message: `Error in deleting image, ${e}`,
    });
    return;
  }
  // Perform the delete
  try {
    // If it's an AWS image, we have to remove it in AWS
    if (isAWS) {
      s3.deleteFile(req.params.imageId);
    }
    const updatedWedding = await weddingData.deleteImage(
      req.params.id,
      req.params.imageId
    );
    await updateWeddingInRedisDB({
      wedding: updatedWedding,
      db: weddings,
      name: "weddings",
    });
    res.json(updatedWedding);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

module.exports = router;

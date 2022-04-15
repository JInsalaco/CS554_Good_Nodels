const express = require("express");
const { EventEmitter } = require("mongodb/lib/apm");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const giftData = data.gifts;
const weddingData = data.weddings;
const checker = require("../data/checker");
const { ObjectId } = require("mongodb");
const { exist } = require("mongodb/lib/gridfs/grid_store");

// POST localhost:3001/weddings/
// Route to create new wedding
router.post("/", async (req, res) => {
  const { venue, title, events, date, contactPerson, rsvpDeadline } = req.body;
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
    res.status(200).send(returnedWedding);
  } catch (e) {
    console.log(500);
    res.status(500).send({ error: e });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  let newWedding = { weddingId: id };
  if (req.body.venue) {
    const venue = req.body.venue;
    newWedding = { ...newWedding, venue };
  }
  if (req.body.title) {
    const title = req.body.title;
    newWedding = { ...newWedding, title };
  }
  if (req.body.events) {
    const events = req.body.events;
    newWedding = { ...newWedding, events };
  }
  if (req.body.date) {
    const date = req.body.date;
    newWedding = { ...newWedding, date };
  }
  if (req.body.contactPerson) {
    const contactPerson = req.body.contactPerson;
    newWedding = { ...newWedding, contactPerson };
  }
  if (req.body.rsvpDeadline) {
    const rsvpDeadline = req.body.rsvpDeadline;
    newWedding = { ...newWedding, rsvpDeadline };
  }

  if (!id) {
    res.status(400).send({ error: "You must provide an id" });
    return;
  }
  try {
    const returnedWedding = await weddingData.updateWedding(newWedding);
    res.status(200).send(returnedWedding);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// PATCH localhost:3001/weddings/:id/event/:eventId
// Route to edit an event within the inputted wedding
router.patch("/:id/event/:eventId", async (req, res) => {
  let eventInfo = req.body;
  let existingEvent;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.eventId);
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
    const updateEvent = await weddingData.editEvent(
      req.params.id,
      req.params.eventId,
      eventInfo
    );
    res.json(updateEvent);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

// PATCH localhost:3001/weddings/:id/attendee/:attendeeId
// Route to edit an attendee within the inputted wedding
router.patch("/:id/attendee/:attendeeId", async (req, res) => {
  let attendInfo = req.body;
  let existingAttend;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.attendeeId);
    if (attendInfo.Name) {
      checker.checkStr(attendInfo.Name);
    }
    if (attendInfo.Email) {
      weddingData.emailValidation(attendInfo.Email);
    }
    if (attendInfo.extras) {
      checker.checkID(attendInfo.extras);
    }
    if (attendInfo.foodChoice) {
      for (let food of attendInfo.foodChoice) checker.checkStr(food);
    }
    if (
      !attendInfo.Name &&
      !attendInfo.Email &&
      !attendInfo.Attending &&
      !attendInfo.extras &&
      !attendInfo.foodChoice
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
  if (!attendInfo.Name) attendInfo.Name = existingAttend.Name;
  if (!attendInfo.Email) attendInfo.Email = existingAttend.Email;
  if (!attendInfo.Attending) attendInfo.Attending = existingAttend.Attending;
  if (!attendInfo.extras) attendInfo.extras = existingAttend.extras;
  if (!attendInfo.foodChoice) attendInfo.foodChoice = existingAttend.foodChoice;
  attendInfo._id = ObjectId(req.params.attendeeId);
  try {
    const editAttendee = await weddingData.editAttendee(
      req.params.id,
      req.params.attendeeId,
      attendInfo
    );
    res.json(editAttendee);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

// PATCH localhost:3001/weddings/:id/image/:imageId
// Route to edit an image within the inputted wedding
router.patch("/:id/image/:imageId", async (req, res) => {
  let imageInfo = req.body;
  let existingImage;
  // Error check
  try {
    checker.checkID(req.params.id);
    checker.checkID(req.params.imageId);
    if (imageInfo.url) {
      checker.checkStr(imageInfo.url);
    }
    if (!imageInfo.url) {
      throw "Nothing to edit in edit image route!";
    }
    // Check that the image actually exists
    let reqWedding = await weddingData.get(req.params.id);
    for (let image of reqWedding.images) {
      if (String(image._id) === req.params.imageId) {
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
    const editImage = await weddingData.editImage(
      req.params.id,
      req.params.imageId,
      imageInfo
    );
    res.json(editImage);
  } catch (e) {
    res.status(500).json({ message: e });
    return;
  }
});

module.exports = router;

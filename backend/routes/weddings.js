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

// GET localhost:3001/weddings
// Returns all weddings from the weddings collection
// May or may not be used
router.get("/", async (req, res) => {
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
    let reqWedding;
    if (!req.params.weddingId) {
        res.status(400).json({ message: "You must pass in a weddingId!" });
        return;
    }
    try {
        reqWedding = await weddingData.get(req.params.weddingId);
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

// GET localhost:3001/user/:userId
// Gets all weddings associated with userId
router.get("/user/:userId", async (req, res) => {
    let userWeddings;
    if (!req.params.userId) {
        res.status(400).json({ message: "You must pass in a userId!" });
        return;
    }
    try {
        userWeddings = await weddingData.getAllUser(req.params.userId);
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
    if (!req.params.id) {
        res.status(400).json({ message: "You must pass in a wedding id!" });
    }
    try {
        wedding = await weddingData.get(req.params.id);
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
    try {
        await weddingData.remove(req.params.id);
    } catch (e) {
        res.status(500).json({ message: `Error deleting wedding: ${e}` });
        return;
    }
    res.sendStatus(200);
});

router.patch("/:id/attendee", async (req, res) => {
    req.params.id = xss(req.params.id);
    if (!req.params.id || typeof req.params.id !== "string" || req.params.id.trim() === "") {
        res.status(400).json({
            message: "Id must be a non-empty string containing more than just spaces.",
        });
        return;
    }

    if (!req.body) {
        res.status(400).json({
            message: "You must provide data to edit an attendee.",
        });
        return;
    }
    let { name, email, attending, extras, foodChoice } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({
            message: "Id must be a non-empty string containing more than just spaces.",
        });
        return;
    }

    if (!email || typeof email !== "string" || email.trim() === "") {
        res.status(400).json({
            message: "email must be a non-empty string containing more than just spaces.",
        });
        return;
    }

    if (!attending || typeof attending !== "boolean") {
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

    if (!foodChoice || !Array.isArray(foodChoice)) {
        res.status(400).json({
            message: "food choice must be an array",
        });
        return;
    }

    try {
        const newWedding = await weddingData.addAttendee(
            req.params.id,
            name,
            email,
            attending,
            extras,
            foodChoice
        );
        res.status(200).json(newWedding);
    } catch (e) {
        res.status(500).json({
            message: `Could not add attendee! ${e}`,
        });
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

router.patch("/:id/event", async (req, res) => {
    req.params.id = xss(req.params.id);
    if (!req.params.id || typeof req.params.id !== "string" || req.params.id.trim() === "") {
        res.status(400).json({
            message: "Id must be a non-empty string containing more than just spaces.",
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
            message: "title must be a non-empty string containing more than just spaces.",
        });
        return;
    }

    if (!date || typeof date !== "object") {
        res.status(400).json({
            message: "date must be an object.",
        });
        return;
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
        res.status(400).json({
            message: "decription must be a non-empty string containing more than just spaces.",
        });
        return;
    }

    try {
        const newWedding = await weddingData.addEvent(req.params.id, title, date, description);
        res.status(200).json(newWedding);
    } catch (e) {
        res.status(500).json({
            message: `Could not add event! ${e}`,
        });
        return;
    }
});

router.patch("/:id/gift", async (req, res) => {
    req.params.id = xss(req.params.id);
    if (!req.params.id || typeof req.params.id !== "string" || req.params.id.trim() === "") {
        res.status(400).json({
            message: "Id must be a non-empty string containing more than just spaces.",
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
            message: "giftId must be a non-empty string containing more than just spaces.",
        });
        return;
    }

    try {
        newWedding = await weddingData.addGift(req.params.id, giftId);
        res.status(200).json(newWedding);
    } catch (e) {
        res.status(500).json({
            message: `Could not add gift! ${e}`,
        });
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
        const editImage = await weddingData.editImage(req.params.id, req.params.imageId, imageInfo);
        res.json(editImage);
    } catch (e) {
        res.status(500).json({ message: e });
        return;
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const giftData = data.gifts;

// GET localhost:3001/gifts
// Returns all gifts from the gift collection
router.get("/", async (req, res) => {
    let allGifts;
    try {
        allGifts = await giftData.getAllGifts();
    } catch (e) {
        res.status(500).json({
            message: `Could not fetch all gifts! ${e}`,
        });
        return;
    }
    res.json(allGifts);
});

// GET localhost:3001/gifts/:giftId
// Returns the inputted gift ID from the gift collection
router.get("/:giftId", async (req, res) => {
    let reqGift;
    if (!req.params.giftId) {
        res.status(400).json({ message: "You must pass in a giftId!" });
        return;
    }
    try {
        reqGift = await giftData.getGift(req.params.giftId);
    } catch (e) {
        res.status(400).json({ message: e });
        return;
    }
    if (!reqGift) {
        res.status(404).json({
            message: `Could not find gift Id: ${req.params.giftId}`,
        });
        return;
    }
    res.json(reqGift);
});

router.post("/", async (req, res) => {
    let giftInfo = req.body;
    giftInfo.title = xss(giftInfo.title);
    giftInfo.url = xss(giftInfo.url);
    giftInfo.picture = xss(giftInfo.picture);
    giftInfo.description = xss(giftInfo.description);
    if (!giftInfo) {
        res.status(400).json({
            message: "You must provide data to add a gift.",
        });
        return;
    }
    giftInfo.parsedPrice = parseFloat(giftInfo.price);
    if (
        !giftInfo.title ||
        typeof giftInfo.title !== "string" ||
        giftInfo.title.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid title.",
        });
        return;
    }
    if (typeof giftInfo.parsedPrice !== "number" || isNaN(giftInfo.parsedPrice) || giftInfo.parsedPrice < 0) {
        res.status(400).json({
            message: "Price must be a number greater than or equal to 0.",
        });
        return;
    }
    if (
        !giftInfo.url ||
        typeof giftInfo.url !== "string" ||
        giftInfo.url.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid url.",
        });
        return;
    }
    if (
        !giftInfo.picture ||
        typeof giftInfo.picture !== "string" ||
        giftInfo.picture.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid picture.",
        });
        return;
    }
    if (
        !giftInfo.description ||
        typeof giftInfo.description !== "string" ||
        giftInfo.description.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid description.",
        });
        return;
    }
    try {
        const newGift = await giftData.create(
            giftInfo.title,
            giftInfo.parsedPrice,
            giftInfo.url,
            giftInfo.picture,
            giftInfo.description
        );
        res.status(200).json(newGift);
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

router.put("/:id", async (req, res) => {
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
    let giftInfo = req.body;
    giftInfo.title = xss(giftInfo.title);
    giftInfo.url = xss(giftInfo.url);
    giftInfo.picture = xss(giftInfo.picture);
    giftInfo.description = xss(giftInfo.description);
    if (!giftInfo) {
        res.status(400).json({
            message: "You must provide data to edit a gift.",
        });
        return;
    }
    giftInfo.id = req.params.id;
    giftInfo.parsedPrice = parseFloat(giftInfo.price);
    if (
        !giftInfo.title ||
        typeof giftInfo.title !== "string" ||
        giftInfo.title.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid title.",
        });
        return;
    }
    if (typeof giftInfo.parsedPrice !== "number" || isNaN(giftInfo.parsedPrice) || giftInfo.parsedPrice < 0) {
        res.status(400).json({
            message: "Price must be a number greater than or equal to 0.",
        });
        return;
    }
    if (
        !giftInfo.url ||
        typeof giftInfo.url !== "string" ||
        giftInfo.url.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid url.",
        });
        return;
    }
    if (
        !giftInfo.picture ||
        typeof giftInfo.picture !== "string" ||
        giftInfo.picture.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid picture.",
        });
        return;
    }
    if (
        !giftInfo.description ||
        typeof giftInfo.description !== "string" ||
        giftInfo.description.trim() === ""
    ) {
        res.status(400).json({
            message: "Invalid description.",
        });
        return;
    }
    try {
        const gift = await giftData.get(req.params.id);
    } catch (e) {
        res.status(404).json({
            message: "Gift not found.",
        });
        return;
    }
    try {
        const updatedGift = await giftData.update(
            req.params.id,
            giftInfo.title,
            giftInfo.parsedPrice,
            giftInfo.url,
            giftInfo.picture,
            giftInfo.description
        );
        res.status(200).json(updatedGift);
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

router.patch("/:id", async (req, res) => {
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
    let gift;
    try {
        gift = await giftData.get(req.params.id);
    } catch (e) {
        res.status(404).json({
            message: "Gift not found.",
        });
        return;
    }
    let giftInfo = req.body;
    if (!giftInfo) {
        res.status(400).json({
            message: "You must provide data to edit a gift.",
        });
        return;
    }
    giftInfo.id = req.params.id;
    if (giftInfo.hasOwnProperty("title")) {
        giftInfo.title = xss(giftInfo.title);
        if (
            !giftInfo.title ||
            typeof giftInfo.title !== "string" ||
            giftInfo.title.trim() === ""
        ) {
            res.status(400).json({
                message: "Invalid title.",
            });
            return;
        }
    } else {
        giftInfo.title = gift.title;
    }
    if (giftInfo.hasOwnProperty("price")) {
        giftInfo.parsedPrice = parseFloat(giftInfo.price);
        if (typeof giftInfo.parsedPrice !== "number" || isNaN(giftInfo.parsedPrice) || giftInfo.parsedPrice < 0) {
            res.status(400).json({
                message: "Price must be a number greater than or equal to 0.",
            });
            return;
        }
    } else {
        giftInfo.parsedPrice = gift.price;
    }
    if (giftInfo.hasOwnProperty("url")) {
        giftInfo.url = xss(giftInfo.url);
        if (
            !giftInfo.url ||
            typeof giftInfo.url !== "string" ||
            giftInfo.url.trim() === ""
        ) {
            res.status(400).json({
                message: "Invalid url.",
            });
            return;
        }
    } else {
        giftInfo.url = gift.url;
    }
    if (giftInfo.hasOwnProperty("picture")) {
        giftInfo.picture = xss(giftInfo.picture);
        if (
            !giftInfo.picture ||
            typeof giftInfo.picture !== "string" ||
            giftInfo.picture.trim() === ""
        ) {
            res.status(400).json({
                message: "Invalid picture.",
            });
            return;
        }
    } else {
        giftInfo.picture = gift.picture;
    }
    if (giftInfo.hasOwnProperty("description")) {
        giftInfo.description = xss(giftInfo.description);
        if (
            !giftInfo.description ||
            typeof giftInfo.description !== "string" ||
            giftInfo.description.trim() === ""
        ) {
            res.status(400).json({
                message: "Invalid description.",
            });
            return;
        }
    } else {
        giftInfo.description = gift.description;
    }
    try {
        const updatedGift = await giftData.update(
            req.params.id,
            giftInfo.title,
            giftInfo.parsedPrice,
            giftInfo.url,
            giftInfo.picture,
            giftInfo.description
        );
        res.status(200).json(updatedGift);
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

// DELETE localhost:3001/gifts/:giftId
// Deletes the inputted gift ID from the gift collection
router.delete("/:giftId", async (req, res) => {
    let reqGift;
    if (!req.params.giftId) {
        res.status(400).json({ message: "You must pass in a giftId!" });
    }
    try {
        reqGift = await giftData.getGift(req.params.giftId);
    } catch (e) {
        res.status(400).json({ message: e });
        return;
    }
    if (!reqGift) {
        res.status(404).json({
            message: `Could not find gift Id: ${req.params.giftId}`,
        });
        return;
    }
    try {
        await giftData.deleteGift(req.params.giftId);
    } catch (e) {
        res.status(500).json({ message: `Error deleting gift: ${e}` });
        return;
    }
    res.sendStatus(200);
});

module.exports = router;

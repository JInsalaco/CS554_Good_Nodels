const express = require("express");
const router = express.Router();
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

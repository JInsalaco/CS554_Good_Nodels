const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../data');
let { ObjectId } = require('mongodb');

const weddingData = data.weddings;

// GET localhost:3001/weddings
// Returns all weddings from the weddings collection
// May or may not be used
router.get('/', async (req, res) => {
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
router.get('/:weddingId', async (req, res) => {
    let reqWedding;
    if (!req.params.weddingId) {
        res.status(400).json({ message: 'You must pass in a weddingId!' });
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
router.get('/user/:userId', async (req, res) => {
    let userWeddings;
    if (!req.params.userId) {
        res.status(400).json({ message: 'You must pass in a userId!' });
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

router.delete('/:id', async (req, res) => {
    let wedding;
    if (!req.params.id) {
        res.status(400).json({ message: 'You must pass in a wedding id!' });
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

router.patch('/:id/attendee', async (req, res) => {
    req.params.id = xss(req.params.id);
    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.trim() === '') {
        res.status(400).json({
            message: 'Id must be a non-empty string containing more than just spaces.',
        });
        return;
    }

    if (!req.body) {
        res.status(400).json({
            message: 'You must provide data to edit an attendee.',
        });
        return;
    }
    let { name, email, attending, extras, foodChoice } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({
            message: 'Id must be a non-empty string containing more than just spaces.',
        });
        return;
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
        res.status(400).json({
            message: 'email must be a non-empty string containing more than just spaces.',
        });
        return;
    }

    if (!attending || typeof attending !== 'boolean') {
        res.status(400).json({
            message: 'attending must be a boolean.',
        });
        return;
    }

    if (!Number.isInteger(extras)) {
        res.status(400).json({
            message: 'extras must be a number',
        });
        return;
    }

    if (!foodChoice || !Array.isArray(foodChoice)) {
        res.status(400).json({
            message: 'food choice must be an array',
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
        return;
    }
});

router.patch('/:id/event', async (req, res) => {
    req.params.id = xss(req.params.id);
    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.trim() === '') {
        res.status(400).json({
            message: 'Id must be a non-empty string containing more than just spaces.',
        });
        return;
    }

    if (!req.body) {
        res.status(400).json({
            message: 'You must provide data to edit an attendee.',
        });
        return;
    }
    let { title, date, description } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({
            message: 'title must be a non-empty string containing more than just spaces.',
        });
        return;
    }

    if (!date || typeof date !== 'object') {
        res.status(400).json({
            message: 'date must be an object.',
        });
        return;
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        res.status(400).json({
            message: 'decription must be a non-empty string containing more than just spaces.',
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

router.patch('/:id/gift', async (req, res) => {
    req.params.id = xss(req.params.id);
    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.trim() === '') {
        res.status(400).json({
            message: 'Id must be a non-empty string containing more than just spaces.',
        });
        return;
    }

    if (!req.body) {
        res.status(400).json({
            message: 'You must provide data to edit an attendee.',
        });
        return;
    }
    let { giftId } = req.body;

    if (!giftId || typeof giftId !== 'string' || giftId.trim() === '') {
        res.status(400).json({
            message: 'giftId must be a non-empty string containing more than just spaces.',
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
        return;
    }
});

module.exports = router;

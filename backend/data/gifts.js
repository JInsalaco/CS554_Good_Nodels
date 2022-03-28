const mongoCollections = require("../config/mongoCollections");
const gifts = mongoCollections.gifts;
const checker = require("./checker");
const { ObjectId } = require("mongodb");

// Returns all gift documents
async function getAllGifts() {
    const giftCollection = await gifts();

    return await giftCollection.find({}).toArray();
}

// Returns gift document based on the parameter that is passed in
// id: Gift ObjectId value
async function getGift(id) {
    const giftId = checker.checkID(id);
    const giftCollection = await gifts();

    return await giftCollection.findOne({ _id: giftId });
}

// Deletes gift document based on the parameter that is passed in
// id: Gift ObjectId value
async function deleteGift(id) {
    const giftId = checker.checkID(id);
    const giftCollection = await gifts();

    try {
        const deleteStatus = giftCollection.deleteOne({_id: giftId});
        if (!deleteStatus.deletedCount) {
            throw `Delete operation did not succeed!`
        }
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getAllGifts,
    getGift,
    deleteGift
}

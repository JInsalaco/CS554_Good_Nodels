const mongoCollections = require("../config/mongoCollections");
const gifts = mongoCollections.gifts;
const weddings = mongoCollections.weddings;
const checker = require("./checker");
const { ObjectId } = require("mongodb");

async function create(title, price, url, picture, description) {
    if (!title || typeof title !== "string" || title.trim() === "") {
        throw new Error(
            "Parameter 1 [title] must be a non-empty string containing more than just spaces."
        );
    }
    if (typeof price !== "number" || isNaN(price) || price < 0) {
        throw new Error(
            "Parameter 2 [price] must be a number greater than or equal to 0."
        );
    }
    if (!url || typeof url !== "string" || url.trim() === "") {
        throw new Error(
            "Parameter 3 [url] must be a non-empty string containing more than just spaces."
        );
    }
    if (!picture || typeof picture !== "string" || picture.trim() === "") {
        throw new Error(
            "Parameter 4 [picture] must be a non-empty string containing more than just spaces."
        );
    }
    if (
        !description ||
        typeof description !== "string" ||
        description.trim() === ""
    ) {
        throw new Error(
            "Parameter 5 [description] must be a non-empty string containing more than just spaces."
        );
    }
    const giftCollection = await gifts();
    const newGift = {
        title: title,
        price: price,
        url: url,
        picture: picture,
        description: description,
    };
    const insertInfo = await giftCollection.insertOne(newGift);
    if (insertInfo.insertedCount === 0)
        throw new Error("Could not create gift.");
    const newId = insertInfo.insertedId;
    return await this.get(newId.toString());
}

async function update(id, title, price, url, picture, description) {
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error(
            "Parameter 1 [id] must be a non-empty string containing more than just spaces."
        );
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
        throw new Error(
            "Parameter 2 [title] must be a non-empty string containing more than just spaces."
        );
    }
    if (typeof price !== "number" || isNaN(price) || price < 0) {
        throw new Error(
            "Parameter 3 [price] must be a number greater than or equal to 0."
        );
    }
    if (!url || typeof url !== "string" || url.trim() === "") {
        throw new Error(
            "Parameter 4 [url] must be a non-empty string containing more than just spaces."
        );
    }
    if (!picture || typeof picture !== "string" || picture.trim() === "") {
        throw new Error(
            "Parameter 5 [picture] must be a non-empty string containing more than just spaces."
        );
    }
    if (
        !description ||
        typeof description !== "string" ||
        description.trim() === ""
    ) {
        throw new Error(
            "Parameter 6 [description] must be a non-empty string containing more than just spaces."
        );
    }
    let parsedId = ObjectId(id);
    const giftCollection = await gifts();
    const gift = await this.get(id);
    const updatedGift = {
        title: title,
        price: price,
        url: url,
        picture: picture,
        description: description,
    };
    const updateInfo = await giftCollection.updateOne(
        { _id: parsedId },
        { $set: updatedGift }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw new Error("Could not update gift.");
    return await this.get(id);
}

// Returns all gift documents
async function getAll() {
    const giftCollection = await gifts();

    const giftList = await giftCollection.find({}).toArray();
    for(let gift of giftList) {
        gift._id = gift._id.toString();
    }
    return giftList;
}

// Returns gift document based on the parameter that is passed in
// id: Gift ObjectId value
async function get(id) {
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error(
            "Parameter 1 [id] must be a non-empty string containing more than just spaces."
        );
    }
    let parsedId = ObjectId(id);
    const giftCollection = await gifts();
    const gift = await giftCollection.findOne({ _id: parsedId });
    if(gift === null) throw new Error("No gift with that id.");
    gift._id = gift._id.toString();
    return gift;
}

// Deletes gift document based on the parameter that is passed in
// id: Gift ObjectId value
async function deleteGift(id) {
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error(
            "Parameter 1 [id] must be a non-empty string containing more than just spaces."
        );
    }
    let parsedGiftId = ObjectId(id);
    const giftCollection = await gifts();
    const gift = await this.get(id);

    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({gifts: id});
    let giftList = wedding.gifts;
    let updatedWedding = {
        gifts: []
    };
    for(let i = 0; i < giftList.length; i++) {
        if(giftList[i] !== id) {
            updatedWedding.gifts.push(giftList[i]);
        }
    }
    let updateInfo = await weddingCollection.updateOne({ _id: wedding._id }, { $set: updatedWedding });
    if(!updateInfo.matchedCount && !updateInfo.modifiedCount) throw new Error('Could not remove gift.');

    const deleteInfo = await giftCollection.deleteOne({_id: parsedGiftId});
    if(deleteInfo.deletedCount === 0) throw new Error('Could not remove gift.');
    return { 'giftId': id, 'deleted': true, 'weddingId': wedding._id };
}

module.exports = {
    create,
    update,
    getAll,
    get,
    deleteGift,
};

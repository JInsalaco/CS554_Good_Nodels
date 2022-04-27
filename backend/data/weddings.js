let { ObjectId } = require("mongodb");

const mongoCollections = require("../config/mongoCollections");
const weddings = mongoCollections.weddings;

const stringValidation = (strList) => {
  strList.forEach((str) => {
    if (typeof str !== "string" || str.trim() === "") {
      throw new Error("Parameter must be a non-empty string");
    }
  });
};

const nullValidation = (params) => {
  params.forEach((param) => {
    if (!param) {
      throw new Error("Parameter cannot be null");
    }
  });
};

const eventsValidation = (events) => {
  if (!Array.isArray(events)) {
    throw new Error("Parameter must be an array.");
  }
  events.forEach((event) => {
    if (!event.title || !event.date || !event.description) {
      throw new Error("Each event must have a title, date, and description.");
    }
  });
};

const dateValidation = (date) => {
  const monthsAndDays = {
    January: 31,
    February: 29,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  const monthsAndDayStrings = Object.keys(monthsAndDays);

  if (
    date.day > monthsAndDays[date.month] ||
    date.day < 1 ||
    date.year < 2022
  ) {
    throw new Error("Invalid date.");
  }
};

const emailValidation = (email) => {
  if (typeof email !== "string" || email.trim() === "") {
    throw new Error("Parameter must be a non-empty string");
  }
  if (!email.includes("@")) {
    throw new Error("Parameter must be a valid email.");
  }
};

let exportedMethods = {
  async getAll() {
    const weddingsCollection = await weddings();
    return await weddingsCollection.find({}).toArray();
  },

  async get(id) {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Parameter must be a non-empty string");
    }
    let parsedId = ObjectId(id);
    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({ _id: parsedId });
    if (wedding === null) throw new Error("No wedding with that id.");
    wedding._id = wedding._id.toString();
    return wedding;
  },

  async getAllUser(userId) {
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      throw new Error("Parameter must be a non-empty string");
    }

    let parsedId = ObjectId(userId);
    const weddingCollection = await weddings();

    const weddingsWithUser = await weddingCollection
      .find({ attendees: { $elemMatch: { _id: parsedId } } })
      .toArray();

    return weddingsWithUser;
  },

  async create({ venue, title, events, date, contactPerson, rsvpDeadline }) {
    nullValidation([venue, title, events, date, contactPerson, rsvpDeadline]);
    stringValidation([venue, title, contactPerson]);
    eventsValidation(events);
    events.forEach((event) => {
      dateValidation(event.date);
    });
    dateValidation(date);
    dateValidation(rsvpDeadline);

    const eventsWithIds = events.map((event) => {
      return {
        ...event,
        _id: ObjectId(),
      };
    });

    const wedding = {
      venue,
      title,
      events: eventsWithIds,
      date,
      contactPerson,
      rsvpDeadline,
      attendees: [],
      gifts: [],
    };

    const weddingCollection = await weddings();
    const insertInfo = await weddingCollection.insertOne(wedding);
    if (insertInfo.insertedCount === 0) {
      throw new Error("Could not create wedding.");
    }

    return await exportedMethods.get(insertInfo.insertedId.toString());
  },

  async addAttendee(weddingId, name, email, attending, extras, foodChoices) {
    stringValidation([weddingId, name]);
    stringValidation(foodChoices);
    emailValidation(email);
    if (typeof attending !== "boolean") {
      throw new Error("Attending must be a boolean.");
    }
    if (typeof extras !== "number" || extras < 0) {
      throw new Error("Extras must be greater than or equal to 0.");
    }
    const attendee = {
      _id: ObjectId(),
      name,
      email,
      attending,
      extras,
      foodChoices,
    };

    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(weddingId),
    });
    if (wedding === null) throw new Error("No wedding with that id.");

    // Here is where the attendee is being added to the wedding
    const updatedWedding = {
      ...wedding,
      attendees: [...wedding.attendees, attendee],
    };

    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $set: updatedWedding }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not add attendee.");
    }

    return await exportedMethods.get(weddingId);
  },

  async addEvent(weddingId, title, date, description) {
    stringValidation([weddingId, title]);
    dateValidation(date);
    stringValidation([description]);

    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(weddingId),
    });

    if (wedding === null) throw new Error("No wedding with that id.");

    const updatedWedding = {
      ...wedding,
      events: [
        ...wedding.events,
        { _id: ObjectId(), title, date, description },
      ],
    };

    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $set: updatedWedding }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not add event.");
    }

    return await exportedMethods.get(weddingId);
  },

  async removeEvent(weddingId, eventId) {
    stringValidation([weddingId, eventId]);

    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(weddingId),
    });

    if (wedding === null) throw new Error("No wedding with that id.");

    const updatedWedding = {
      ...wedding,
      events: wedding.events.filter(
        (event) => event._id.toString() !== eventId
      ),
    };

    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $set: updatedWedding }
    );

    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not remove event.");
    }

    return await exportedMethods.get(weddingId);
  },

  async removeAttendee(weddingId, attendeeId) {
    stringValidation([weddingId, attendeeId]);
    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(weddingId),
    });
    if (wedding === null) throw new Error("No wedding with that id.");

    // Here is where the attendee is being removed from the wedding
    const updatedWedding = {
      ...wedding,
      attendees: wedding.attendees.filter(
        (attendee) => attendee._id.toString() !== attendeeId
      ),
    };

    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $set: updatedWedding }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not remove attendee.");
    }

    return await exportedMethods.get(weddingId);
  },

  async addGift(weddingId, giftId) {
    stringValidation([weddingId, giftId]);
    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(weddingId),
    });
    if (wedding === null) throw new Error("No wedding with that id.");

    // Here is where the gift is being added to the wedding
    const updatedWedding = {
      ...wedding,
      gifts: [...wedding.gifts, ObjectId(giftId)],
    };

    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $set: updatedWedding }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not add gift.");
    }

    return await exportedMethods.get(weddingId);
  },

  async removeGift(weddingId, giftId) {
    stringValidation([weddingId, giftId]);
    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(weddingId),
    });
    if (wedding === null) throw new Error("No wedding with that id.");

    // Here is where the gift is being removed from the wedding
    const updatedWedding = {
      ...wedding,
      gifts: wedding.gifts.filter((gift) => gift.toString() !== giftId),
    };

    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $set: updatedWedding }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not remove gift.");
    }

    return await exportedMethods.get(weddingId);
  },

  async updateWedding({
    weddingId,
    venue,
    title,
    events,
    date,
    contactPerson,
    rsvpDeadline,
  }) {
    if (venue) {
      stringValidation([venue]);
    }
    if (title) {
      stringValidation([title]);
    }
    if (contactPerson) {
      stringValidation([contactPerson]);
    }
    if (events) {
      eventsValidation(events);
    }
    if (date) {
      dateValidation(date);
    }
    if (rsvpDeadline) {
      dateValidation(rsvpDeadline);
    }

    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(weddingId),
    });

    let updatedWedding = wedding;
    if (venue) {
      updatedWedding.venue = venue;
    }
    if (title) {
      updatedWedding.title = title;
    }
    if (events) {
      updatedWedding.events = events;
    }
    if (date) {
      updatedWedding.date = date;
    }
    if (contactPerson) {
      updatedWedding.contactPerson = contactPerson;
    }
    if (rsvpDeadline) {
      updatedWedding.rsvpDeadline = rsvpDeadline;
    }

    if (wedding === null) throw new Error("No wedding with that id.");

    // Here is where the attendee is being added to the wedding

    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $set: updatedWedding }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not add attendee.");
    }

    return await exportedMethods.get(weddingId);
  },

  async remove(id) {
    stringValidation([id]);
    const weddingCollection = await weddings();
    const wedding = await weddingCollection.findOne({
      _id: ObjectId(id),
    });
    if (wedding === null) throw new Error("No wedding with that id.");

    const deleteInfo = await weddingCollection.deleteOne({
      _id: ObjectId(id),
    });
    if (deleteInfo.deletedCount === 0) {
      throw new Error("Could not delete wedding.");
    }

    return exportedMethods.getAll();
  },

  async editEvent(weddingId, eventId, newEvent) {
    stringValidation([weddingId, eventId]);
    stringValidation[newEvent.title];
    dateValidation(newEvent.date);
    stringValidation[newEvent.description];

    const weddingCollection = await weddings();
    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId), "events._id": ObjectId(eventId) },
      { $set: { "events.$": newEvent } }
    );

    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not edit Event.");
    }

    return exportedMethods.get(weddingId);
  },

  async deleteEvent(weddingId, eventId) {
    stringValidation([weddingId, eventId]);

    const weddingCollection = await weddings();
    const deleteInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $pull: { events: { _id: ObjectId(eventId) } } }
    );

    if (deleteInfo.modifiedCount === 0) {
      throw new Error("Could not delete event.");
    }

    return exportedMethods.get(weddingId);
  },

  async editAttendee(weddingId, attendeeId, newAttendee) {
    stringValidation([weddingId, attendeeId]);
    stringValidation[newAttendee.Name];
    emailValidation(newAttendee.Email);
    if (newAttendee.Attending !== true && newAttendee.Attending !== false)
      throw `Invalid attending field in editAttendee`;
    if (isNaN(parseInt(newAttendee.extras) || newAttendee.extras % 1 !== 0))
      throw `Invalid extras field in editAttendee`;
    for (let food of newAttendee.foodChoice) stringValidation([food]);

    const weddingCollection = await weddings();
    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId), "attendees._id": ObjectId(attendeeId) },
      { $set: { "attendees.$": newAttendee } }
    );

    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not edit attendee.");
    }

    return exportedMethods.get(weddingId);
  },

  async editImage(weddingId, imageId, newImage) {
    stringValidation([weddingId, imageId, newImage.url]);

    const weddingCollection = await weddings();
    const updateInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId), "images._id": ObjectId(imageId) },
      { $set: { "images.$": newImage } }
    );

    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not edit Image.");
    }

    return exportedMethods.get(weddingId);
  },

  async deleteImage(weddingId, imageId) {
    stringValidation([weddingId, imageId]);

    const weddingCollection = await weddings();
    const deleteInfo = await weddingCollection.updateOne(
      { _id: ObjectId(weddingId) },
      { $pull: { images: { _id: ObjectId(imageId) } } }
    );

    if (deleteInfo.modifiedCount === 0) {
      throw new Error("Could not delete Image");
    }

    return exportedMethods.get(weddingId);
  },

  async addImage(weddingId, url) {
    stringValidation([weddingId, url]);

    const weddingCollection = await weddings();
    const insertInfo = await weddingCollection.updateOne(
      {
        _id: ObjectId(weddingId),
      },
      { $push: { images: { _id: ObjectId(), url: url } } }
    );

    if (insertInfo.modifiedCount === 0) {
      throw new Error("Could not add Image");
    }

    return exportedMethods.get(weddingId);
  },

  //get wedding by email provided by firebase
  async getByContactPerson(email){
    stringValidation([email]);
    const weddingCollection = await weddings();
    const data = await weddingCollection.findOne({contactPerson: email});

    if(!data){
      throw new Error(`Could not find wedding for user ${email}`)
    }

    return data;
  },

  dateValidation,
  emailValidation,
};

const main = async () => {
  // console.log(
  //   await exportedMethods.create(
  //     "The Church",
  //     "The Wedding",
  //     [
  //       {
  //         title: "The Ceremony",
  //         date: {
  //           day: 1,
  //           month: "January",
  //           year: 2023,
  //         },
  //         description: "The Ceremony",
  //       },
  //       {
  //         title: "The Reception",
  //         date: {
  //           day: 1,
  //           month: "January",
  //           year: 2023,
  //         },
  //         description: "The Reception",
  //       },
  //     ],
  //     {
  //       month: "January",
  //       day: 1,
  //       year: 2024,
  //     },
  //     "John Doe",
  //     {
  //       month: "August",
  //       day: 1,
  //       year: 2023,
  //     }
  //   )
  // );
  // console.log(
  //   await exportedMethods.create(
  //     "The Beach",
  //     "wedding yo",
  //     [
  //       {
  //         title: "The Ceremony",
  //         date: {
  //           day: 7,
  //           month: "February",
  //           year: 2024,
  //         },
  //         description: "The Ceremony",
  //       },
  //       {
  //         title: "The Bachelor Party",
  //         date: {
  //           day: 3,
  //           month: "January",
  //           year: 2024,
  //         },
  //         description: "its gonna be crazy!!!",
  //       },
  //     ],
  //     {
  //       month: "February",
  //       day: 7,
  //       year: 2024,
  //     },
  //     "Joe Mama",
  //     {
  //       month: "August",
  //       day: 1,
  //       year: 2023,
  //     }
  //   )
  // );
  // console.log(
  //   await exportedMethods.addAttendee(
  //     "62471491284efd732307bfc0",
  //     "Peter Pan",
  //     "ppan@yahoo.com",
  //     true,
  //     0,
  //     ["Chicken", "Beef", "Fish"]
  //   )
  // );
  // console.log(
  //   await exportedMethods.addGift(
  //     "624715f116920a75799b21e6",
  //     "62471491284efd732307bfc0"
  //   )
  // );
  // console.log(
  //   await exportedMethods.updateWedding({
  //     weddingId: "62471491284efd732307bfc0",
  //     title: "new title",
  //     date: {
  //       month: "February",
  //       day: 2,
  //       year: 2024,
  //     },
  //   })
  // );
  // console.log(
  //   await exportedMethods.removeEvent(
  //     "62471491284efd732307bfc0",
  //     "62471491284efd732307bfbf"
  //   )
  // );
  // console.log(
  //   await exportedMethods.removeGift(
  //     "624715f116920a75799b21e6",
  //     "62471491284efd732307bfc0"
  //   )
  // );
  // console.log(await exportedMethods.getAll());
  // console.log(await exportedMethods.remove("6247166fd48f1c768351b8fb"));
};

// main();

module.exports = exportedMethods;

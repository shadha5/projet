const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const person = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      select: false,
      require: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { collection: "Persons" }
);

person.post("findOneAndUpdate", async (doc, next) => {
  if (doc) {
    //    LODASH
    const _ = require("lodash");

    //  IDS TO UPDATE THEIR CONTACTS STATUS
    const ids = [];

    //  GET ALL RELATED CONTACTS
    const contacts = await global.Relation.find({
      persons: { $in: [doc._id] },
    });

    //  ELIMINATE THE PERSON FROM UPDATE
    contacts.forEach(async (contact, i) => {
      contact.persons.forEach((person, i) => {
        if (person !== doc._id) {
          ids.push(person);
        }
      });
    });

    ids.forEach(async (id, i) => {
      //  GET ALL RELATED CONTACTS
      const contactsToPush = await global.Relation.find({
        persons: { $in: [id] },
      }).populate("persons");

      //  GET ONLINE CLIENTS
      const clients = await global.Client.find({
        person: id,
        active: true,
      });

      //  EMIT DATA
      clients.forEach(async (client) => {
        emitterClient = global.io[client.socket];
        if (emitterClient) {
          emitterClient.emit("setContacts", contactsToPush);
        }
      });
    });
  }
  next();
});

person.index({ username: "text", first_name: "text", last_name: "text" });

module.exports = mongoose.model("persons", person);

// models/Person.js
// Defines the Person schema and exports the Person model.

const mongoose = require("mongoose");

// Person Prototype:
//   name: string [required]
//   age: number
//   favoriteFoods: array of strings
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // every person must have a name
    trim: true,     // remove extra spaces around the name
  },
  age: {
    type: Number,
    min: 0,         // simple validator: age can't be negative
  },
  favoriteFoods: {
    type: [String], // declared as [String], so no markModified() is needed on push
    default: [],    // default value when no foods are given
  },
});

// "Person" becomes the "people" collection in MongoDB
const Person = mongoose.model("Person", personSchema);

module.exports = Person;

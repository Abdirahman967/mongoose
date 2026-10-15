// myApp.js
// All the checkpoint exercises. Each function takes a Node-style callback
// called `done(err, data)` and passes it the result of the database operation.

const Person = require("./models/Person");

// ---------------------------------------------------------------
// 1. Create and Save a Record of a Model
// ---------------------------------------------------------------
const createAndSavePerson = (done) => {
  // Build a new document from the Person model
  const person = new Person({
    name: "John",
    age: 25,
    favoriteFoods: ["pizza", "pasta"],
  });

  // Save it, using the Node convention callback (err, data)
  person.save(function (err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

// ---------------------------------------------------------------
// 2. Create Many Records with Model.create()
// ---------------------------------------------------------------
const createManyPeople = (arrayOfPeople, done) => {
  // Model.create() takes an array of objects and saves them all
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return done(err);
    done(null, people);
  });
};

// ---------------------------------------------------------------
// 3. Use Model.find() to search the database
// ---------------------------------------------------------------
const findPeopleByName = (personName, done) => {
  // find() returns an array of every matching person
  Person.find({ name: personName }, function (err, people) {
    if (err) return done(err);
    done(null, people);
  });
};

// ---------------------------------------------------------------
// 4. Use Model.findOne() to return a single matching document
// ---------------------------------------------------------------
const findOneByFood = (food, done) => {
  // Matching a value inside an array field finds people whose
  // favoriteFoods contains `food`. findOne() returns only the first match.
  Person.findOne({ favoriteFoods: food }, function (err, person) {
    if (err) return done(err);
    done(null, person);
  });
};

// ---------------------------------------------------------------
// 5. Use Model.findById() to search by _id
// ---------------------------------------------------------------
const findPersonById = (personId, done) => {
  Person.findById(personId, function (err, person) {
    if (err) return done(err);
    done(null, person);
  });
};

// ---------------------------------------------------------------
// 6. Classic update: Find, Edit, then Save
// ---------------------------------------------------------------
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  // Find the person first...
  Person.findById(personId, function (err, person) {
    if (err) return done(err);
    if (!person) return done(new Error("Person not found"));

    // ...edit the document in memory...
    person.favoriteFoods.push(foodToAdd);

    // ...then save it inside the find callback.
    // (Not needed here because favoriteFoods is [String], but if it were
    //  declared as a plain Array we would call person.markModified("favoriteFoods").)
    person.save(function (err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};

// ---------------------------------------------------------------
// 7. New update: Model.findOneAndUpdate()
// ---------------------------------------------------------------
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },  // search by name
    { age: ageToSet },     // set age to 20
    { new: true },         // return the UPDATED document, not the original
    function (err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

// ---------------------------------------------------------------
// 8. Delete one document with Model.findByIdAndRemove()
// ---------------------------------------------------------------
const removeById = (personId, done) => {
  // Passes the removed document to the callback
  Person.findByIdAndRemove(personId, function (err, removedPerson) {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

// ---------------------------------------------------------------
// 9. Delete many documents with Model.remove()
// ---------------------------------------------------------------
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  // remove() doesn't return the deleted docs, but an outcome object
  // such as { acknowledged: true, deletedCount: 2 }
  Person.remove({ name: nameToRemove }, function (err, result) {
    if (err) return done(err);
    done(null, result);
  });
};

// ---------------------------------------------------------------
// 10. Chain search query helpers to narrow results
// ---------------------------------------------------------------
const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch }) // people who like burritos
    .sort({ name: 1 })                          // sort by name, A→Z
    .limit(2)                                   // only 2 results
    .select({ age: 0 })                         // hide the age field
    .exec(function (err, people) {              // run the query
      if (err) return done(err);
      done(null, people);
    });
};

module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain,
};

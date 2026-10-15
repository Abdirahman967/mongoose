// index.js
// Connects to MongoDB, then runs every exercise from myApp.js in order
// and prints the result of each one.

require("dotenv").config(); // loads MONGO_URI from the .env file
const mongoose = require("mongoose");
const app = require("./myApp");
const Person = require("./models/Person");

// Turn off a Mongoose 6 deprecation warning about query filters
mongoose.set("strictQuery", true);

// ---------------------------------------------------------------
// Connect to MongoDB Atlas using the URI stored in .env
// ---------------------------------------------------------------
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing. Copy .env.example to .env and add your Atlas URI.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

// Small helper to print each step's result
const show = (title, data) => {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(data, null, 2));
};

// Sample data used to seed the database
const arrayOfPeople = [
  { name: "Mary", age: 30, favoriteFoods: ["burrito", "salad"] },
  { name: "Mary", age: 22, favoriteFoods: ["sushi"] },
  { name: "Alice", age: 28, favoriteFoods: ["burrito", "tacos"] },
  { name: "Bob", age: 35, favoriteFoods: ["burrito", "steak"] },
  { name: "Charlie", age: 40, favoriteFoods: ["ugali", "nyama choma"] },
];

// ---------------------------------------------------------------
// Run the exercises one after another, once connected
// ---------------------------------------------------------------
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  // Start from an empty collection so every run gives the same output
  Person.deleteMany({}, (err) => {
    if (err) return finish(err);

    // 1. Create and save one person
    app.createAndSavePerson((err, john) => {
      if (err) return finish(err);
      show("1. createAndSavePerson", john);

      // 2. Create many people
      app.createManyPeople(arrayOfPeople, (err, people) => {
        if (err) return finish(err);
        show("2. createManyPeople", people);

        // 3. Find all people named "Mary"
        app.findPeopleByName("Mary", (err, marys) => {
          if (err) return finish(err);
          show('3. findPeopleByName("Mary")', marys);

          // 4. Find one person who likes sushi
          app.findOneByFood("sushi", (err, sushiFan) => {
            if (err) return finish(err);
            show('4. findOneByFood("sushi")', sushiFan);

            // 5. Find John by his _id
            app.findPersonById(john._id, (err, found) => {
              if (err) return finish(err);
              show("5. findPersonById(john._id)", found);

              // 6. Add "hamburger" to John's favorite foods
              app.findEditThenSave(john._id, (err, edited) => {
                if (err) return finish(err);
                show("6. findEditThenSave(john._id)", edited);

                // 7. Set Alice's age to 20
                app.findAndUpdate("Alice", (err, alice) => {
                  if (err) return finish(err);
                  show('7. findAndUpdate("Alice")', alice);

                  // 8. Delete John by _id
                  app.removeById(john._id, (err, removed) => {
                    if (err) return finish(err);
                    show("8. removeById(john._id)", removed);

                    // 9. Delete every "Mary"
                    app.removeManyPeople((err, result) => {
                      if (err) return finish(err);
                      show('9. removeManyPeople() — name "Mary"', result);

                      // 10. Burrito lovers, sorted, max 2, no age
                      app.queryChain((err, burritoFans) => {
                        if (err) return finish(err);
                        show("10. queryChain() — burrito lovers", burritoFans);
                        finish();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Close the connection when everything is done (or if something failed)
function finish(err) {
  if (err) console.error("\nError:", err.message);
  mongoose.connection.close(() => {
    console.log("\nConnection closed");
    process.exit(err ? 1 : 0);
  });
}

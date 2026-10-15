# Mongoose Checkpoint

CRUD exercises on a `Person` model with Mongoose and MongoDB Atlas.

## Setup
```bash
npm install
cp .env.example .env
```
Open `.env` and paste your MongoDB Atlas connection string:
```
MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/checkpoint?retryWrites=true&w=majority"
```
No spaces around the `=`. Keep the quotes.

## Run
```bash
npm start
```
This connects to the database and runs every exercise in order, printing each result.

## Files
| File | What it does |
|------|--------------|
| `models/Person.js` | Person schema: `name` (required), `age`, `favoriteFoods` ([String]) |
| `myApp.js` | One function per exercise, each using a `done(err, data)` callback |
| `index.js` | Connects with `mongoose.connect()` and runs all the exercises |

## Exercises covered
1. `createAndSavePerson`: `new Person()` + `save()`
2. `createManyPeople`: `Model.create()`
3. `findPeopleByName`: `Model.find()`
4. `findOneByFood`: `Model.findOne()`
5. `findPersonById`: `Model.findById()`
6. `findEditThenSave`: find, `push("hamburger")`, `save()`
7. `findAndUpdate`: `findOneAndUpdate()` with `{ new: true }`
8. `removeById`: `findByIdAndRemove()`
9. `removeManyPeople`: `Model.remove({ name: "Mary" })`
10. `queryChain`: `.find().sort().limit().select().exec()`

## Note on the Mongoose version
This project uses **Mongoose 6** on purpose. The checkpoint uses callbacks,
`Model.remove()` and `findByIdAndRemove()`, and Mongoose 7 and later removed all three.

## Atlas tips
- In Atlas → Network Access, allow your IP address (or `0.0.0.0/0` while testing).
- In Atlas → Database Access, create a user and use its username/password in the URI.

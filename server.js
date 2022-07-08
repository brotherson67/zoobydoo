// get animal data
const { animals } = require("./data/animal_data.json");
// install file system manager
const fs = require("fs");
const path = require("path");
//install expressjs
const express = require("express");
// create instance of express app
const app = express();
// Define Port app will run on
const PORT = process.env.PORT || 3000;

// express middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

// query handler function
function filterByQuery(query, animalsArray) {
  // create array to store personality traits
  let personalityTraitsArray = [];
  // create localized instance of animals array
  let filteredResults = animalsArray;

  // if the query is for personality traits
  if (query.personalityTraits) {
    // save it as the personalityTraitsArray
    // if it is a string add it to the array
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
  }

  // loop through each personality trait
  personalityTraitsArray.forEach((trait) => {
    filteredResults = filteredResults.filter(
      // return all the animals that have a personality trait that were mentioned in the query
      (animals) => animals.personalityTraits.indexOf(trait) !== -1
    );
    // after looping through all traits only animals that have all the mentioned traites will remain
  });

  if (query.diet) {
    // redefine filteredResults
    filteredResults = filteredResults.filter(
      // as only the parts of the animal array that match query parameters
      (animals) => animals.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animals) => animals.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animals) => animals.name === query.name
    );
  }
  return filteredResults;
}

// function to find animals by their ID
function findById(id, animalsArray) {
  // return the object at index 0 that has the id matching the parameter
  const result = animalsArray.filter((animals) => animals.id === id)[0];
  return result;
}

// function to create a new animal
function createNewAnimal(body, animalsArray) {
  // define the animal as the request payload
  const animal = body;
  // add the animal to the animals array
  animalsArray.push(animal);
  // write new array to the source file
  fs.writeFileSync(
    path.join(__dirname, "./data/animal_data.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to POST route for response
  return animal;
}

// data validation function
function validateAnimal(animal) {
  // make sure the animal name is a string
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  // make sure the animal species is a string
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  // make sure animal diet is a string
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  // make sure personality traits is in an array
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  // return true if it's passed all the validations
  return true;
}

// animal route
app.get("/api/animals", (req, res) => {
  // create local instance of animal array
  let results = animals;
  if (req.query) {
    // if there were query parameters, redefine the results as the query specified field
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// get specific animals
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
    // if there is not a matching animal, send 404
  } else {
    res.send(404);
  }
});

// animal creation route
app.post("/api/animals", (req, res) => {
  // set the new animal id
  req.body.id = animals.length.toString();
  // if there is anything incorrect about the payload, return 400
  if (!validateAnimal(req.body)) {
    res.status(400).send("the animal is not formatted correctly");
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    res.json(req.body);
  }
});

app.listen(PORT, (req, res) => {
  console.log(`The express app is running on server ${PORT}`);
});

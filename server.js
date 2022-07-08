// get animal data
const { animals } = require("./data/animal_data.json");
//install expressjs
const express = require("express");
// create instance of express app
const app = express();
// Define Port app will run on
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, (req, res) => {
  console.log(`The express app is running on server ${PORT}`);
});

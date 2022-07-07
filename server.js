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
  let filteredResults = animalsArray;
  if (query.diet) {
    filteredResults = filteredResults.filter(
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
      (animals) => animals.name === animals.query
    );
  }
  return filteredResults;
}

// animal route
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    // if there were parameters, define the results as the query specified field
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.listen(PORT, (req, res) => {
  console.log(`The express app is running on server ${PORT}`);
});

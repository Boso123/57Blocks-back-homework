const { default: mongoose } = require("mongoose");

const pokemonSchema = mongoose.Schema({
  name: String,
  nivel: Number,
  type: String,
  image: String,
  user: String
});

module.exports = pokemonSchema;
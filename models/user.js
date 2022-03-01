const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String,
  lastConnection: { type: Date, default: Date.now },
  pokemons: [],
  kid: String
});

module.exports = userSchema;
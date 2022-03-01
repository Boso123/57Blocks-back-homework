const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  lastConnection: { type: Date, default: Date.now },
  kid: String
});

module.exports = userSchema;
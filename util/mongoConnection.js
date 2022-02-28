const mongoose = require('mongoose');
const logger = require('./logger/logger');

const userSchema = require('../models/user')
const pokemonSchema = require('../models/pokemon')

class MongoConnection {
  url = "mongodb+srv://blocks:57blocks@pokemons.haboa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  user = null;
  pokemon = null;

  constructor() {
    this.connect().catch(err => logger.error(err));
    this.user = mongoose.model('user', userSchema);
    this.pokemon = mongoose.model('pokemon', pokemonSchema);
  }

  getSchema(schemaName) {
    switch (schemaName) {
      case "user":
        return this.user;
      case "pokemon":
        return this.pokemon;
      default:
        throw "Cannot find schema name " + schemaName
    }
  }

  async find(schemaType, query) {
    var schema = this.getSchema(schemaType);
  }

  async findById(schemaType, id) {
    var schema = this.getSchema(schemaType);

  }

  async delete(schemaType, query) {
    var schema = this.getSchema(schemaType);

  }

  async update(schemaType, query, replaceQuery) {
    var schema = this.getSchema(schemaType);

  }

  async create(schemaType, query) {
    var schema = this.getSchema(schemaType);
    var element = new schema(query);
    await element.save();
    return element;
  }

  async connect() {
    await mongoose.connect(this.url);
    logger.info("Connection successful")
  }
}

module.exports = MongoConnection;
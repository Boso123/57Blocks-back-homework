const mongoose = require('mongoose');
const logger = require('./logger/logger');

const userSchema = require('../models/user')
const pokemonSchema = require('../models/pokemon');
const res = require('express/lib/response');

class MongoConnection {
  url = process.env.DB;
  user = null;
  pokemon = null;

  constructor() {
    this.connect().catch(err => logger.error(err));
    this.user = mongoose.model('user', userSchema);
    this.pokemon = mongoose.model('pokemon', pokemonSchema);
  }

  /**
   * Retrives the needed schema
   * @param {*} schemaName name of the schema needed
   * @returns mongoose schema
   */
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

  /**
   * Find a document in the database
   * @param {*} schemaType name of the schema
   * @param {*} query Query to run in the database
   * @returns Founded documents
   */
  async find(schemaType, query) {
    var schema = this.getSchema(schemaType);

    const response = await schema.find(query);
    return response;
  }

  /**
   * Delete document for database
   * @param {*} schemaType name of the schema
   * @param {*} query Query to execute in databsae
   * @returns Number of documents affected
   */
  async delete(schemaType, query) {
    var schema = this.getSchema(schemaType);
    const response = schema.deleteMany({query});
    return response;
  }

  /**
   * Update a document in the database
   * @param {*} schemaType name of the schema
   * @param {*} query query to find documents to chanfe
   * @param {*} replaceQuery Change to made in documents
   * @returns Number of documents affecter
   */
  async update(schemaType, query, replaceQuery) {
    var schema = this.getSchema(schemaType);
    const response = await schema.updateMany(query, replaceQuery);

    return {
      matchCount: response.matchCount,
      modified: response.modifiedCount
    }
  }

  /**
   * Creates a new document in databse
   * @param {*} schemaType name of the schema
   * @param {*} query query of document to save
   * @returns document saved
   */
  async create(schemaType, query) {
    var schema = this.getSchema(schemaType);
    var element = new schema(query);
    const response = await element.save();
    return response;
  }

  /**
   * Connect to database
   */
  async connect() {
    await mongoose.connect(this.url);
    logger.info("Connection successful")
  }
}

module.exports = MongoConnection;
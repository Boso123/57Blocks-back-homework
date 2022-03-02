var express = require('express');
var router = express.Router();
const Mongo = require('../util/mongoConnection');
const response = require('../util/standardResponse')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const user = res.locals.userEmail;
  const mongo = new Mongo();

  var pokemons = await mongo.find('pokemon', { user: user });

  res.status(200).json(response({
    user: user,
    pokemons: pokemons
  }, 'success', 'retrived'));
});

router.get('/:pokemonName', async function (req, res, next) {
  const user = res.locals.userEmail;
  const mongo = new Mongo();
  const pokemonName = req.params.pokemonName;

  var pokemons = await mongo.find('pokemon', { user: user, name: pokemonName });

  if (pokemons.length == 0) {
    res.status(404).json(response("You dont have that pokemon", 'error', 'pokemonNotFound'));
    return;
  }

  res.status(200).json(response({
    user: user,
    pokemons: pokemons
  }, 'success', 'retrived'));
});

router.post('/add', async function (req, res, next) {
  const user = res.locals.userEmail;
  const mongo = new Mongo();
  var data = req.body;

  var pokemons = await mongo.find('pokemon', { user: user, name: data.name });

  if (pokemons.length > 0) {
    res.status(400).json(response("You already have that pokemon", 'error', 'pokemonAlreadyExits'));
    return;
  }

  data.user = user;
  const pokemon = await mongo.create('pokemon', data);

  res.status(200).json(response(pokemon, 'success', 'added'));
});

router.put('/update/:pokemonName', async function (req, res, next) {
  const user = res.locals.userEmail;
  const mongo = new Mongo();
  const pokemonName = req.params.pokemonName;
  const data = req.body;

  var pokemons = await mongo.find('pokemon', { user: user, name: pokemonName });

  if (pokemons.length == 0) {
    res.status(404).json(response("You dont have that pokemon", 'error', 'pokemonNotFound'));
    return;
  }

  const pokemon = await mongo.update('pokemon', { user: user, name: pokemonName }, data);

  res.status(200).json(response(pokemon, 'success', 'updated'));
});

router.delete('/remove/:pokemonName', async function (req, res, next) {
  const user = res.locals.userEmail;
  const mongo = new Mongo();
  const pokemonName = req.params.pokemonName;

  var pokemons = await mongo.find('pokemon', { user: user, name: pokemonName });

  if (pokemons.length == 0) {
    res.status(404).json(response("You dont have that pokemon", 'error', 'pokemonNotFound'));
    return;
  }

  const deleteResult = await mongo.delete('pokemon', { user: user, name: pokemonName });
  res.status(200).json(response(deleteResult, 'success', 'deleted'));
});

module.exports = router;

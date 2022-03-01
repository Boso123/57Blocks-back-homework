var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const httpLogger = require('./util/logger/httpLogger');
const middleware = require('./util/validateUser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pokemonRouter = require('./routes/pokemon');
var authRouter = require('./routes/auth');

var app = express();
var router = express.Router();

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/pokemon', middleware , pokemonRouter);
app.use('/api/auth', authRouter);

module.exports = app;

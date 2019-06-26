'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

/*Test connection*/
// const sequelize = require('sequelize');

// const sequelize = require('./models').sequelize;

const {sequelize} = require('./models');
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Create the Express app.
const app = express();

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Setup request body JSON parsing.
app.use(express.json());

// Setup morgan which gives us HTTP request logging.
app.use(morgan('dev'));

// import index.js
const routes = require('./routes/index');
var usersRoute = require('./routes/users');
const coursesRoute = require('./routes/courses');

// TODO setup your api routes here
app.use('/api', routes); //list of users
app.use('/api/users', usersRoute);
app.use('/api/courses', coursesRoute);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other routes matched
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err); // to next middleware below
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

'use strict';

const express = require('express');
const {User} = require('../models');
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const router = express.Router();

router.use((req, res, next) => {
  let message = null;

  // Get the user's credentials from the Authorization header.
  const credentials = auth(req);
  // Check for User by email and alert errors where not authenticated
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    User.findOne({
      where: {
        emailAddress: credentials.name
      }
    })
    .then (user => {
      // console.log("user: ", credentials.name);
      // If a user was successfully retrieved from the data store...
      if (user) {
        // Use the bcryptjs npm package to compare the user's password
        // (from the Authorization header) to the user's password
        // that was retrieved from the data store.
        let authenticated = bcryptjs.compareSync(credentials.pass, user.password);
        // If the passwords match...
        if (authenticated) {
          console.log(`Bravo! Successful for username: ${user.emailAddress}`);
          // Then store the retrieved user object on the request object
          // so any middleware functions that follow this middleware function
          // will have access to the user's information.
          req.currentUser = user;
          next();//pass any Sequelize validation errors to the global error handler.
        } else { //input password is not correct
          message = 'Oooop! Wrong password';
          res.status(401);
          res.json( { message: message} );
        }
      } else { // There is no username on the database
        message = `Opppp! Wrong username: ${credentials.name}`;
        res.status(401);
        res.json( { message: message });
      }
    });
  } else {
    const err = new Error('Access Denied! Please sign in your account!');
    err.status = 401;
    next(err);//pass any Sequelize validation errors to the global error handler.
  }
});

module.exports = router;

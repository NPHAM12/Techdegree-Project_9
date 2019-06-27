const express = require('express');
const router = express.Router();
const auth = require('./authenticateUser');
const bcryptjs = require("bcryptjs");

//import model User
const {User} = require('../models');

// GET /api/users 200 - Returns the currently authenticated user
router.get("/", auth, (req, res) => {
  const user = req.currentUser;
  const currentUser={
    id: user.id,
    firstName: user.emailAddress,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  }
  res.status(200).json({
      "user": currentUser
    });
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post("/", (req, res, next) => {
  const newUser = req.body;
  // console.log(newUser);
  //Check all inputs
  // if (newUser.firstName == false
  //     || newUser.lastName == false
  //     || newUser.emailAddress == false
  //     || newUser.password == false) {
  // the condition "above" will be bad when one of conditions is "undefined"

  if (!newUser.firstName || !newUser.lastName
      || !newUser.emailAddress || !newUser.password){
    const err = new Error("Missing firstName, lastName, emailAddress or password!");
    err.status = 400;
    next(err);//pass any Sequelize validation errors to the global error handler.
  } else { //If email is valid, then create a new user
    User.findOne({
        where: {
          emailAddress: newUser.emailAddress
        }
      })
      .then( (newEmail) => {
        //If a new email does not exist
        if (!newEmail) {
          // Hash the new user's password.
          newUser.password = bcryptjs.hashSync(newUser.password);
          //Create a new user
          User.create(newUser)
            .then(() => {
              res.location('/');  //Set location header
              res.status(201).end();
            })
            //Catch error and check if Sequelize validation  error (not using) and pass error to next middleware
            .catch(err => {
              err.status = 400;
              next(err); //pass any Sequelize validation errors to the global error handler.
            });
        }else { //if email exists
          const err = new Error('Exist email. Please, select another one!');
          err.status = 400;
          next(err);//pass any Sequelize validation errors to the global error handler.
        }
      });
  }
});

module.exports = router; 

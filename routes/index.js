var express = require('express');
var router = express.Router();

/* GET home page. */
//  redirect hompage /api to /api/users route and display all users from the database
router.get('/', function(req, res, next) {
  console.log("here");
  res.redirect("/api/users")
});

module.exports = router;

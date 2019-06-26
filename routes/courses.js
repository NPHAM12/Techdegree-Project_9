const express = require('express');
const router = express.Router();
const {Course, User} = require('../models');
const auth = require('./authenticateUser');

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
// SELECT id, title, description, estimatedTime, materialsNeeded,
// , userId (SELECT id, firstName, lastName, emailAddress FROM User)
// FROM Course
router.get('/', (req, res, next) => {
  Course.findAll({
      attributes: [
        'id',
        'title',
        'description',
        'estimatedTime',
        'materialsNeeded',
        'userId'
      ],
      include: [{
        model: User,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'emailAddress'
        ]
      }]
    })
    .then((allCourses) => {
      res.status(200).json({
        "Courses": allCourses
      });
    })
    .catch((err) => {
      next(err); //pass any Sequelize validation errors to the global error handler.
    });
});

// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/:id', (req, res, next) => {
  // SELECT id, title, description, estimatedTime, materialsNeeded,
  // , userId (SELECT id, firstName, lastName, emailAddress FROM User)
  // WHERE id = query FROM Course
  // search for attributes -> findONE, NOT findByPk (for known id)
  Course.findOne({
      where: {
        id: req.params.id
      }, //condition == id
      attributes: [
        'id',
        'title',
        'description',
        'estimatedTime',
        'materialsNeeded',
        'userId'
      ],
      include: [{
        model: User,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'emailAddress',
          // 'password'
        ]
      }]
    })
    .then((getCourses) => {
      if (!getCourses) {
        const err = new Error('Page Not Found');
        err.status = 404;
        next(err); //pass any Sequelize validation errors to the global error handler.
      } else {
        res.status(200).json({
          "Course": getCourses
        });
      }
    })
});

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no contentrouter.post('/', (req, res, next) => {
router.post('/', auth, (req, res, next) => {
  const newCourse = req.body;
  //Check empty title or empty description
  if(newCourse.id){
    const err = new Error("No Need id!");
    err.status = 500;
    next(err);//pass any Sequelize validation errors to the global error handler.
  }
  else if (newCourse.title == false || newCourse.description == false){
    const err = new Error("Missing title or description!!!");
    err.status = 400;
    next(err); //pass any Sequelize validation errors to the global error handler.
  }else{
    //Find a title of course to check with a new title
    Course.findOne({
      where: {
        title: newCourse.title}
      })
      .then( (newTitle) => {
        //Check the exist course
        //If a new course does NOT match with any of the exist courses
        if(!newTitle){
          //create a new course
          Course.create(newCourse)
            .then ( () => {
              res.location('/api/courses/' + newCourse.id);  //Set location header
              res.status(201).end();//return no content
            })
            .catch(err => {
              err.status = 500;
              next(err); //pass any Sequelize validation errors to the global error handler.
            });
        }else { // if a new course match with one of the exist courses
          const err = new Error('Exist course, Please, select another one!');
          err.status = 400;
          next(err); //pass any Sequelize validation errors to the global error handler.
          }
        })
      }
});

router.put('/:id', auth, (req, res, next) => {
  const course = req.body;
  //Check empty title or empty description
  // Check empty title or empty description
  if (course.title == false || course.description == false) {
    const err = new Error("Missing title or description!!!");
    err.status = 400;
    next(err); //pass any Sequelize validation errors to the global error handler.
  } else {
    //Find a course to modify
    Course.findOne({
        where: {
          id: course.id
        }
      })
      .then((currentCourse) => {
        //having an exist course
        if (currentCourse) {
          //Modifying contents in course
          currentCourse.id = course.id,
            currentCourse.title = course.title,
            currentCourse.description = course.description,
            currentCourse.estimatedTime = course.estimatedTime,
            currentCourse.materialsNeeded = course.materialsNeeded,
            
            //updating the modified course
            currentCourse.update(course);
          res.status(204).end(); //Return no content
        } else { // No exist course
          res.status(400).json({
            message: 'Ooop! No Exist Course!'
          });
        }
      })
      .catch((err) => {
        err.status = 500;
        next(err);//pass any Sequelize validation errors to the global error handler.
      });
  }
});

// DELETE /api/courses/:id 204 - Deletes a course and returns no content

router.delete('/:id', auth, (req, res, next) => {
  Course.findByPk(req.params.id)
    .then((delCourse) => {
      // the deleted course is on the database
      if (delCourse) {
        return delCourse.destroy();
      } else { // the deleted course is NOT on the database
        const err = new Error('Ooop! The course is not on the database!');
        err.status = 400;
        next(err);//pass any Sequelize validation errors to the global error handler.
      }
    })
    .then(() => {
      res.status(204).end();//Return no content
    })
    .catch((err) => {
      err.status = 500;
      next(err);//pass any Sequelize validation errors to the global error handler.
    });
});

module.exports = router;

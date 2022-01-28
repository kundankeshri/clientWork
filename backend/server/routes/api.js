const express = require('express');
const router = express.Router();
const userRegistration = require('../controller/registration-controller.js')
const quiz = require('../controller/quiz-data')
const downloadQuiz = require('../controller/downloadQuiz')
const uploadQuiz = require('../controller/uploadQuiz')

var connection = require('../../Connection');

// User Registration starts from here 
// add a new user with details 
router.post("/userRegistration", userRegistration.create);

// User Registration ends from here 

/* GET api listing. */
router.route('/authenticateuser').post(async function (req, res) {
  try {
  console.log('UserName'+JSON.stringify(req.body.username));
  console.log('UserName'+JSON.stringify(req.params));
   var username = req.param("username");
   var password = req.param("password");
  // password = new Buffer(password, 'base64');
   var query ='SELECT * FROM tbl_adim_user_details where user_name=\''+username+'\' and user_full_name = \''+password+'\' ';
 
     [rows, fields]  =  await connection.query(query);
     let list = Object.values(JSON.parse(JSON.stringify(rows)));
     res.send(list)
   } catch (error) {
    res.status(200).send("error");
     console.log(error);
   } 
  });

// New Project data fetch 
router.route('/getSubjectList').get(async function (request, response) {
  try {
    var query ='SELECT * FROM db_myproj.tbl_subject_list';
       [rows, fields]  =  await connection.query(query);
      let list = Object.values(JSON.parse(JSON.stringify(rows)));
      response.send(list)
    } catch (error) {
      res.status(200).send("error");
      console.log(error)
    }
  
    });

    router.route('/getTopicList/:id').get(async function (request, response) {
      try {
        var query =`SELECT * FROM tbl_topic_list as r where r.subject_id =${request.params.id}`;
           [rows, fields]  =  await connection.query(query);
           let list = Object.values(JSON.parse(JSON.stringify(rows)));
           response.send(list)
        } catch (error) {
          res.status(200).send("error");
          console.log(error);
        } 
        });
  // fetch quiz questions
  router.get("/getQuizQuestion/:id",quiz.getQuizData );
  router.post("/downloadQuizTemplate",downloadQuiz.downloadQuizTemplate );
  router.post("/uploadQuizTemplate",uploadQuiz.uploadQuizTemplate );


module.exports = router;

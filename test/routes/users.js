var express = require('express');
var router = express.Router();
var connection = require('../Connection');
//const userRegistration = require('../controller/registration-controller.js')
// const quiz = require('../controller/quiz-data')
// const downloadQuiz = require('../controller/downloadQuiz')
// const uploadQuiz = require('../controller/uploadQuiz')
const userRegistration = require('../server/controller/registration-controller.js')
const quiz = require('../server/controller/quiz-data')
const downloadQuiz = require('../server/controller/downloadQuiz')
const downloadMainsQuizTemplate = require('../server/controller/downloadMainsQuizTemplate')
const uploadQuiz = require('../server/controller/uploadQuiz')
const uloadQuizMains = require('../server/controller/uloadQuizMains')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
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
    res.status(500).send(error);
     console.log(error);
   } 
  });

// New Project data fetch 
router.route('/getSubjectList').get(async function (request, response) {
  try {
    var query ='SELECT * FROM tbl_subject_list';
       [rows, fields]  =  await connection.query(query);
      let list = Object.values(JSON.parse(JSON.stringify(rows)));
      response.send(list)
    } catch (error) {
      response.status(500).send({"kundan":error});
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
          response.status(200).send(error);
          console.log(error);
        } 
        });
  // fetch quiz questions
  router.get("/getQuizQuestion/:id",quiz.getQuizData );
  router.post("/downloadQuizTemplate",downloadMainsQuizTemplate.downloadQuizTemplate );
  router.post("/downloadMainsQuizTemplate",downloadMainsQuizTemplate.downloadMainsQuizTemplate );
  router.post("/uploadQuizTemplate",uploadQuiz.uploadQuizTemplate );
    router.post("/uploadQuizMainsTemplate",uloadQuizMains.uloadQuizMains );



module.exports = router;

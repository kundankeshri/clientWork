var connection = require('../../Connection');
var xlsx = require('node-xlsx');
var async = require("async");
var formidable = require("formidable");



exports.uploadQuizTemplate = async(req, res) => {
   
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async function(err,fields,files){
            fileData = files.upload;
            var oldpath = files.upload.path; 
            //"C:\\Users\\kundan keshri\\Downloads\\master-data-master\\master-data-master\\server\\document\\book1.xlsx";
            fileName = "book1.xlsx";
            obj = xlsx.parse(oldpath);
            if(obj.length == 0 ||obj[0].data.length == 0 ){
                res.status(200).send("Empty excel file");
            }
            xmlContent = obj[0].data.filter(e=>e.length > 0);
            process_rows(xmlContent,req,res,fileName);
        })
       
     }
        catch (err) {
            res.status(200).send("error");
            console.log(err.message);
        }
}

function  process_rows(obj,req,res,fileName){
    var isPaused = true;
    var accepted = 0;
    var rejected = 0;
    var updated = 0;
    var duplicate = 0;
    var total_rows = obj.length;
    file_meta_data = {};

    var dataWithoutHeader = obj.splice(1,); 
    async.forEachOf(dataWithoutHeader, async function(row, j, callback) {
        let indexOfQuestion = obj[0].indexOf('question');
        let indexOfOptionA = obj[0].indexOf('A');
        let indexOfOptionB = obj[0].indexOf('B');
        let indexOfOptionC = obj[0].indexOf('C');
        let indexOfOptionD = obj[0].indexOf('D');
        let indexOfAnswer = obj[0].indexOf('answer');
        let indexOfSubjectId = obj[0].indexOf('subject_id');
        let indexOfTopicId = obj[0].indexOf('topic_id');
        let isValidSubjectId = false;
        let isVAlidTopicId = false;
        let isValidOptionA = false;
        let isValidOptionB = false;
        let isValidOptionC = false;
        let isValidOptionD = false;
        let isValidAnswer = false;
        let isValidQuestion = false;
        isVAlidTopicId = await checkForVAlidTopicId(row[indexOfTopicId],row[indexOfSubjectId]);
        isValidSubjectId = await checkForVAlidSubjectId(row[indexOfSubjectId]);
        isValidOptionA = checkForValidOption(row[indexOfOptionA]);
        isValidOptionB = checkForValidOption(row[indexOfOptionB]);
        isValidOptionC = checkForValidOption(row[indexOfOptionC]);
        isValidOptionD = checkForValidOption(row[indexOfOptionD]);
        isValidQuestion = checkForValidOption(row[indexOfQuestion]);
        isValidAnswer = checkForValidAnswer(row[indexOfAnswer]);

        if(isVAlidTopicId && isValidSubjectId && isValidOptionA && isValidOptionB
           && isValidOptionC && isValidOptionD && isValidQuestion && isValidAnswer){
            let query = `INSERT INTO tbl_question(name,topic_id,question_type_id,subject_id) VALUES('${row[indexOfQuestion]}','${row[indexOfTopicId]}',1,'${row[indexOfSubjectId]}')`;
            try {
                 [rows, fields]  =  await connection.query(query); 
            } catch (error) {
                console.log(error);
            }
            let questionAdded = Object.values(JSON.parse(JSON.stringify(rows)));  
            if(questionAdded && questionAdded.length >0 ){
                var question_id = questionAdded[2];
               if(row[indexOfOptionA]){
                let status = 0;
                (row[indexOfAnswer] == 'A') ? status = 1 : status = 0;
                let query = `INSERT INTO  tbl_options(isAnswer,name,questionId) VALUES(${status},'${row[indexOfOptionA]}',${question_id})`;
                try {
                     [rows, fields]  =  await connection.query(query);
                } catch (error) {
                    console.log(error);
                }
                }
               if(row[indexOfOptionB]){
                let status = 0;
                (row[indexOfAnswer] == 'B') ? status = 1 : status = 0;
                let query = `INSERT INTO  tbl_options(isAnswer,name,questionId) VALUES(${status},'${row[indexOfOptionB]}',${question_id})`;
                try {
                     [rows, fields]  =  await connection.query(query); 
                } catch (error) {
                    console.log(error);
                }
                }
               if(row[indexOfOptionC]){
                let status = 0;
                (row[indexOfAnswer] == 'C') ? status = 1 : status = 0;
                let query = `INSERT INTO  tbl_options(isAnswer,name,questionId) VALUES(${status},'${row[indexOfOptionC]}',${question_id})`;
               try {
                 [rows, fields]  =  await connection.query(query);                   
               } catch (error) {
                   console.log(error);
               }
                }
               if(row[indexOfOptionD]){
                let status = 0;
                (row[indexOfAnswer] == 'D') ? status = 1 : status = 0;
                let query = `INSERT INTO  tbl_options(isAnswer,name,questionId) VALUES(${status},'${row[indexOfOptionD]}',${question_id})`;
                 [rows, fields]  =  await connection.query(query);
                }
            }  
            console.log('kundan keshri');
        
        }else{
            let errList = []
            let error_type = "";
            rejectCollection = "bulkUploadRejectRecords";
           if(isVAlidTopicId == false){
            error_type = error_type + " Invalid topic id" + '; ';
            errList.push("Topic Id")
           }
           if(isValidSubjectId == false){
            error_type = error_type + " Invalid subject id" + '; ';
            errList.push("Subject Id")
           }
           if(isValidOptionA == false){
            error_type = error_type + " Invalid Option A" + '; ';
            errList.push("Option A")
           }
           if(isValidOptionB == false){
            error_type = error_type + " Invalid Option B" + '; ';
            errList.push("Option B")
           }
           if(isValidOptionC == false){
            error_type = error_type + " Invalid Option C" + '; ';
            errList.push("Option C")
           }
           if(isValidOptionD == false){
            error_type = error_type + " Invalid Option D" + '; ';
            errList.push("Option D")
           }
           if(isValidQuestion == false){
            error_type = error_type + " Invalid Question" + '; ';
            errList.push("Question")
           }
           if(isValidAnswer == false){
            error_type = error_type + " Invalid Answer" + '; ';
            errList.push("Answer")
           }
           let query = `INSERT INTO  bulkuploadrejectrecords(question,optionA,optionB,optionC,optionD,answer,subjectId,topicId,error) VALUES('${row[indexOfQuestion]}','${row[indexOfOptionA]}','${row[indexOfOptionB]}','${row[indexOfOptionC]}','${row[indexOfOptionD]}','${row[indexOfAnswer]}','${row[indexOfSubjectId]}','${row[indexOfTopicId]}','${error_type}')`;
           try {
             [rows, fields]  =  await connection.query(query); 
           } catch (error) {
              console.log(error); 
           }
           let topicType = Object.values(JSON.parse(JSON.stringify(rows)));
           console.log('keshri')
        }
     //   callback();
    })
    res.status(200).send("kundan keshri");
}
function checkForValidAnswer(data){
 let isValid = false;
 let optionList = ['A','B','C','D'];
 if(data){
     let answer = optionList.filter(e=>e=='A');
     if(answer && answer.length > 0){
         isValid = true;
     }
 }
 return isValid;
}

function checkForValidOption(data){
 let isValid = true;
 if(data && data.length > 0){
     isValid = true;
 }
 return isValid;
}

async function checkForVAlidTopicId(id,subject_id) {
    let isValid = false;
    if(!isNaN(id) && !isNaN(subject_id)){
        let query = `SELECT * FROM  tbl_topic_list where id = ${id} and subject_id = ${subject_id}`;
       try {
         [rows, fields]  =  await connection.query(query);
       } catch (error) {
           console.log(error)
       }
        let result = Object.values(JSON.parse(JSON.stringify(rows)));
        if(result && result.length > 0){
            isValid = true;
        }
    }
    return isValid;
}

async function checkForVAlidSubjectId(id) {
    let isValid = false;
    if(!isNaN(id)){
    let query = `SELECT * FROM  tbl_subject_list where id = ${id} and isPrilims =1`;
   try {
     [rows, fields]  =  await connection.query(query);
   } catch (error) {
       console.log(error);
   }
    let result = Object.values(JSON.parse(JSON.stringify(rows)));
    if(result && result.length > 0){
        isValid = true;
    }
   }
   return isValid;
}

 


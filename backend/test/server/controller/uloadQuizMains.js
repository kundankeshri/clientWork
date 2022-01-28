var connection = require('../../Connection');
var xlsx = require('node-xlsx');
var async = require("async");
var formidable = require("formidable");



exports.uloadQuizMains = async(req, res) => {
   
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
        let indexOfPaperId = obj[0].indexOf('paper_id');
        let indexOfPaperListId = obj[0].indexOf('paper_list_id');
        let indexOfTopicId = obj[0].indexOf('topic_id');
        let indexOfQuestion = obj[0].indexOf('question');
        let indexOfDescription= obj[0].indexOf('description');
        let indexOfRemarks = obj[0].indexOf('remarks');
        
        let isValidPaperId = false;
        let isVAlidPaperListId = false;
        let isValidTopicId = false;
		 isVAlidPaperId = await checkForVAlidPaperId(row[indexOfPaperId]);
		 isValidPaperListId = await checkForVAlidPaperListId(row[indexOfPaperListId]);
         isVAlidTopicId = await checkForVAlidTopicId(row[indexOfTopicId]);
        

        if(isVAlidTopicId && isVAlidPaperId && isValidPaperListId){
            let query = `INSERT INTO tbl_mains_question(question, paper_id, paper_list_id, remarks, description, topic_id) VALUES('${row[indexOfQuestion]}','${row[indexOfPaperId]}','${row[indexOfPaperListId]}','${row[indexOfRemarks]}','${row[indexOfDescription]}','${row[indexOfTopicId]}')`;
            try {
                 [rows, fields]  =  await connection.query(query); 
            } catch (error) {
                console.log(error);
            }
           
            console.log('kundan keshri');
        
        }else{
            let errList = []
            let error_type = "";
            rejectCollection = "bulkUploadRejectRecordsForMains";
           if(isVAlidTopicId == false){
            error_type = error_type + " Invalid topic id" + '; ';
            errList.push("Topic Id")
           }
           if(isVAlidPaperId == false){
            error_type = error_type + " Invalid paper id" + '; ';
            errList.push("Subject Id")
           }
           if(isValidPaperListId == false){
            error_type = error_type + " Invalid paper list id" + '; ';
            errList.push("Option A")
           }
           let query = `INSERT INTO bulkUploadRejectRecordsForMains(question, paper_id, paper_list_id, remarks, description, topic_id,error) VALUES('${row[indexOfQuestion]}','${row[indexOfPaperId]}','${row[indexOfPaperListId]}','${row[indexOfRemarks]}','${row[indexOfDescription]}','${row[indexOfTopicId]}','${error_type}')`;

           try {
             [rows, fields]  =  await connection.query(query); 
           } catch (error) {
              console.log(error); 
           }
          // let topicType = Object.values(JSON.parse(JSON.stringify(rows)));
           console.log('keshri')
        }
     //   callback();
    })
    res.status(200).send("kundan keshri");
}



async function checkForVAlidTopicId(id,) {
    let isValid = false;
    if(!isNaN(id) ){
        let query = `SELECT * FROM  tbl_mains_subject_list where id = ${id} `;
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

async function checkForVAlidPaperListId(id) {
    let isValid = false;
    if(!isNaN(id)){
    let query = `SELECT * FROM  tbl_mains_subject_list where paper_list_id = ${id} `;
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

async function checkForVAlidPaperId(id) {
    let isValid = false;
    if(!isNaN(id)){
    let query = `SELECT * FROM  tbl_mains_subject_list where paper_id = ${id} `;
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


 


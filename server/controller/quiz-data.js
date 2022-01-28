var connection = require('../../Connection');
exports.getQuizData = async(req, res) => {
  try {
  console.log('kundan')
  let id = 1;
  let topicId =req.params.id;
  let questions = [];
  let query = `SELECT * FROM tbl_question_type where id = ${id} and isActive =1`;
  
     [rows, fields]  =  await connection.query(query);
 
  let questionType = Object.values(JSON.parse(JSON.stringify(rows)));
  let query1 = `SELECT *,t.name as questionName ,t.id as questionId FROM   tbl_question as t ,tbl_options as p 
  where  t.topic_id = ${topicId} and t.id = p.questionId `;
  try {
     [rows1, fields1]  =  await connection.query(query1);
  } catch (error) {
    console.log(error);
  }
  let query2 = `SELECT * FROM tbl_topic_list as r where r.id = ${topicId}`
  try {
     [rows2, fields2]  =  await connection.query(query2);
  } catch (error) {
    console.log(error);
  }
  let topicType = Object.values(JSON.parse(JSON.stringify(rows2)));

  let options = Object.values(JSON.parse(JSON.stringify(rows1)));
  if(options && options.length > 0){
    let distinctQuestionList = options.map(item => item.questionId)
    .filter((value, index, self) => self.indexOf(value) === index);
    for(let i=0;i< distinctQuestionList.length;i++){
       let obj ={
           'id': options[distinctQuestionList[i]],
           'name' :options.filter(e=>e.questionId ==  distinctQuestionList[i])[0].questionName,
           'options': options.filter(e=>e.questionId ==  distinctQuestionList[i]),
           'questionType' : questionType[0],
           'questionTypeId' : questionType[0].id
       }
       questions.push(obj);
    }
    let obj1 = {'id':topicType[0].id, 'name' :topicType[0].title, 'questions':questions,'description':topicType[0].title}
    res.send(obj1);
}else{
  let obj1 = {'id':topicType[0].id, 'name' :topicType[0].title, 'questions':questions,'description':topicType[0].title}
  res.send(obj1);
}
} catch (error) {
  res.status(200).send("error");
  console.log(error);
}
}


 


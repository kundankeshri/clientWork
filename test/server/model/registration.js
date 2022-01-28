var sql = require('../config/db');


const Registration = function(registration) {
    this.age = registration.age;
    this.email = registration.email;
    this.expertise = registration.expertise;
    this.first_name = registration.first_name;
    this.last_name = registration.last_name;
    this.gender = registration.gender;
    this.password = registration.password;
    this.reset_password = registration.reset_password;
    this.phone_number = registration.phone_number;
    this.term_and_condion = registration.term_and_condion;
    this.created_on = registration.created_on;
    this.created_by = registration.created_by;
    this.status = registration.status;
  };



  Registration.create = (newRegisteredUser,result) => {
    try{
    sql.query("INSERT INTO tbl_registered_user_details SET ?", newRegisteredUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("created customer: ", { id: res.insertId, ...newRegisteredUser });
      try{
        let userObj = {'user_name':newRegisteredUser.email,'user_full_name':newRegisteredUser.password};
       sql.query("INSERT INTO tbl_adim_user_details SET ?", userObj,(err, res) => {
         if (err) {
           console.log("error: ", err);
           result(err, null);
           return;
         }
        result(null, { data : "Registered Successfully" });
       });
     } catch (error) {
       res.status(200).send("error");
        console.log(error);
      } 
    });
  } catch (error) {
    res.status(200).send("error");
     console.log(error);
   } 
  };

  module.exports = Registration;


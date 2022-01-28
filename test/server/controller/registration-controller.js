const Registration = require("../model/registration");

exports.create = (req, res) => {
 try {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    // Create a Customer
    const registration = new Registration({
        age  :  req.body.regAge,
        email  :  req.body.regEmail,
        expertise  :  req.body.regExpertiese,
        first_name  :  req.body.regFirstName,
        last_name  :  req.body.regLastName,
        gender  :  req.body.regGender,
        password  :  req.body.regPassword,
        reset_password  :  req.body.regResetPassword,
        phone_number  :  req.body.regPhoneNumber,
        term_and_condion  :  req.body.regTermAndCondition,
        created_on  :  new Date(),
        created_by  :  req.body.regFirstName,
        status  :  false
      });

      console.log('registration',registration)
  
    Registration.create(registration, (err, data) => {
      if (err){
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      } 
      else{
        res.send(data);
      } 
    });
  } catch (error) {
    res.status(200).send("error");
     console.log(error);
   } 
    
  };
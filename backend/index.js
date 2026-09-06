const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();


const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");




const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000,function(){
    console.log("Server is running on port 5000");
})

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === "user" &&
    password === "user@123"
  ) {
    return res.json({
      success: true,
      message: "Login successful"
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
});


 mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Database connected");

 }).catch((err)=>{
    console.error("Error connecting to database:", err);
 });

 const credential = mongoose.model("credential",{},"bulkmail");

 
app.post("/sendemail", function(req, res) {

  var msg = req.body.msg;
  console.log(msg);
  var emailList = req.body.emailList;
  console.log(emailList);

   var subject = req.body.subject;
  console.log(subject);

  credential.find().then((data)=>{

    console.log("Credential data:", data)
    

  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  },
});


 new Promise( async (resolve,reject) =>{
    try{
        for (var i = 0; i < emailList.length; i++) {
    transporter.sendMail(
    {
      from: "lithishv141@gmail.com",
      to: emailList[i],
      subject: subject,
      text: msg,
    }
   )
     console.log("Email sent to " + emailList[i]);
  
  }

   resolve("Success");

    }
  
    catch(error){

      reject("Failed");

    }
  })
    .then(()=>{
      res.send(true);
    })
    .catch(()=>{
      res.send(false);
    })
  })

}    

)


  


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


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Database connected");

}).catch((err) => {
  console.error("Error connecting to database:", err);
});

const credential = mongoose.model("credential", {}, "bulkmail");


app.post("/sendemail", async (req, res) => {
  try {
    const msg = req.body.msg;
    const emailList = req.body.emailList;
    const subject = req.body.subject;

    console.log("Subject:", subject);
    console.log("Email List:", emailList);

    const data = await credential.find();

    console.log("Credential data:", data);

    if (data.length === 0) {
      console.log("❌ No credentials found in MongoDB");
      return res.status(500).send("No credentials found");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].user,
        pass: data[0].pass,
      },
    });

    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: data[0].user,
        to: emailList[i],
        subject: subject,
        text: msg,
      });

      console.log("Email sent to:", emailList[i]);
    }

    res.send(true);

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
    res.status(500).send(false);
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});





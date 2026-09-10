const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();


const { AgentMailClient } = require("agentmail");
const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");




const app = express();
app.use(cors());
app.use(express.json());



const agentmail = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY
});

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



app.post("/sendemail", async (req, res) => {
  try {
    const msg = req.body.msg;
    const emailList = req.body.emailList;
    const subject = req.body.subject;

    console.log("🔥 SEND EMAIL ROUTE HIT");
    console.log("Subject:", subject);
    console.log("Email List:", emailList);

    for (let i = 0; i < emailList.length; i++) {

      const result = await agentmail.inboxes.messages.send(
        "bulkmail@agentmail.to",
        {
          to: emailList[i],
          subject: subject,
          text: msg,
          html: `<p>${msg}</p>`
        }
      );

      console.log("✅ Email sent to:", emailList[i]);
      console.log("AgentMail ID:", result.messageId);
    }

    res.send(true);

  } catch (error) {

    console.log("❌ EMAIL ERROR:", error);

    res.status(500).send(false);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});





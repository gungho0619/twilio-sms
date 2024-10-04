require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // Parse JSON data in request body

app.use(bodyParser.urlencoded({ extended: true }));

// Twilio Account details from environment variables
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const verifyServiceSid = process.env.VERIFY_SERVICE_SID;

// Create Twilio client
const client = twilio(accountSid, authToken);

// Endpoint to send verification code
app.post("/send-code", (req, res) => {
  const { phoneNumber } = req.body; // Get phone number from the request body
  client.verify.v2
    .services(verifyServiceSid)
    .verifications.create({ to: phoneNumber, channel: "sms" })
    .then((verification) => {
      res.json({
        message: `Verification code sent to ${phoneNumber}`,
        status: verification.status,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: "Failed to send verification code",
        details: error.message,
      });
    });
});

// Endpoint to verify the code
app.post("/verify-code", (req, res) => {
  const { phoneNumber, code } = req.body; // Get phone number and code from the request body

  client.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({ to: phoneNumber, code })
    .then((verification_check) => {
      if (verification_check.status === "approved") {
        res.json({ message: "Phone number verified successfully!" });
      } else {
        res.status(400).json({
          message: `Verification failed. Status: ${verification_check.status}`,
        });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Error verifying code", details: error.message });
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

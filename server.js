require("dotenv").config();
// Import the Twilio module
const twilio = require("twilio");

// Your Twilio Account SID and Auth Token
const accountSid = process.env.ACCOUNT_SID; // Replace with your Twilio Account SID
const authToken = process.env.AUTH_TOKEN; // Replace with your Twilio Auth Token

// Your Twilio Verify Service SID

const verifyServiceSid = process.env.VERITY_SERVICE_SID; // Replace with your Verify Service SID

// Create Twilio client
const client = twilio(accountSid, authToken);

// Function to send a verification code to a phone number
const sendVerificationCode = (phoneNumber) => {
  client.verify.v2
    .services(verifyServiceSid)
    .verifications.create({ to: phoneNumber, channel: "sms" }) // 'sms' is used to send via SMS, can also use 'call' for voice
    .then((verification) =>
      console.log(
        `Verification code sent to ${phoneNumber}: ${verification.status}`
      )
    )
    .catch((error) => console.error("Error sending verification code:", error));
};

// Example: Send a verification code to a specific phone number
sendVerificationCode(phoneNumber); // Replace with the phone number to which the code should be sent

const nodemailer = require("nodemailer");

// Function to generate a OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

let current_otp = 0;
// Function to send the OTP email
async function sendOTPEmail(userEmail, otp) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "shanu999akz@gmail.com",
      pass: "osen saup rfzu ntll",
    },
  });

  // Set up email options
  let mailOptions = {
    from: "shanu999akz@gmail.com", // sender address
    to: userEmail, // recipient's email
    subject: "Your OTP Code sendddeddd",
    text: `Your OTP code is ${otp}. Its valid for 10 minutes.`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${userEmail}: ${otp}`);
}

module.exports = { sendOTPEmail, generateOTP };

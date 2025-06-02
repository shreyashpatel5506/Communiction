const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

//Global Values
let otpLength = 5;
let userid = null;
let transporter = null;

//reading HTML file
const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      console.log(err)
      throw err;
    } else {
      callback(null, html);
    }
  });
};

// Setting up sender email
const setupSenderEmail = (options) => {
  transporter = nodemailer.createTransport({
    service: options.service,
    auth: {
      user: options.user,
      pass: options.pass,
    },
  });
};

//Send new OTP to an Email
const sendOTP = async (data, succFun) => {
  otp = "";
  for (let i = 1; i <= otpLength; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  //calling to read html
  readHTMLFile(__dirname + "/otp.html", function (err, html) {
    let template = handlebars.compile(html);
    let message = data.message === undefined ? "" : data.message;
    let replacements = { otp: otp, message: message };
    let htmlToSend = template(replacements);

    let options = {
      from: userid,
      to: data.to,
      subject: data.subject !== undefined ? data.subject : "OTP Confirmation",
      //adding html template
      html: htmlToSend,
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        succFun(err, otp);
        return console.log(error.message);
      }
      succFun(err, otp);
    });
  });
};

module.exports = {
  setupSenderEmail,
  sendOTP,
};

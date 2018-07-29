// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendEmail = functions.database.ref('/sendBox/{pushKey}').onWrite((change, context) => {
  const beforeData = change.before.val(); // data before the write
  const afterData = change.after.val(); // data after the write
  if (beforeData || !afterData) {
    return;
  }
  const mailOptions = {
    to: 'tzef8220@gmail.com, info@bsaa.org',
    subject: `${afterData.title}`,
    html: afterData.html
  };
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Mail sent to: tzef8220@gmail.com, info@bsaa.org'); //The log will be shown in Firebase.
  });
})

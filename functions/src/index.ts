// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const DOMAIN = 'sandboxca123201cec648a0ab77478ca357cd1a.mailgun.org';
const mailgun = require("mailgun-js")({apiKey: 'key-3c4f40a52c498010f52973eb13de1017', domain: DOMAIN});

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// const nodemailer = require('nodemailer');
// const gmailEmail = encodeURIComponent(functions.config().gmail.email);
// const gmailPassword = encodeURIComponent(functions.config().gmail.password);
// const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendEmail = functions.database.ref('/sendBox/{pushKey}').onWrite(change => {
  const beforeData = change.before.val(); // data before the write
  const afterData = change.after.val(); // data after the write
  if (beforeData || !afterData) {
    return 0;
  }

  const mailOptions = {
    from: 'bsaa@sandboxca123201cec648a0ab77478ca357cd1a.mailgun.org',
    to: 'info@bsaa.org',
    subject: `${afterData.title}`,
    html: afterData.html
  };
  return new Promise((resolve, reject) => {
    mailgun.messages().send(mailOptions, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
  // return mailTransport.sendMail(mailOptions).then(() => {
  //   console.log('Mail sent to: tzef8220@gmail.com, info@bsaa.org'); //The log will be shown in Firebase.
  // });
})

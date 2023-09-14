const MailComposer = require('nodemailer/lib/mail-composer');
const mailgun = require('../config/mailgun');

const sendEmail = ({ to, subject, text, html, from, attachments }) =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    const emailData = {
      from,
      to,
      subject,
      text,
    };

    const resolveOrReject = (err, res) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      return resolve(res);
    };

    if (!html && attachments) {
      const attch = attachments.map(
        (attachment) => new mailgun.Attachment(attachment)
      );

      return mailgun
        .messages()
        .send({ ...emailData, attachment: attch }, resolveOrReject);
    }

    emailData.html = html;
    const mail = new MailComposer(emailData);
    mail.compile().build((err, message) => {
      if (err) {
        console.log(err);
        return;
      }

      const dataToSend = {
        to,
        message: message.toString('ascii'),
      };

      mailgun.messages().sendMime(dataToSend, resolveOrReject);
    });
  });

module.exports = sendEmail;

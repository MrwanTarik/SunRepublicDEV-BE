const fs = require('fs');

const router = require('express').Router();

const { imageUploader } = require('../config/multer');
const sendEmail = require('../helpers/sendEmail');
const { SENDER_EMAIL, RECEIVER_EMAIL } = require('../config/constants');
const axios = require('axios');

router.post('/', async (req, res) => {
  try {    
    // await sendEmail({
    //   from: SENDER_EMAIL,
    //   to: RECEIVER_EMAIL,
    //   subject: 'New message',
    //   text: 
    // });

    const { name, phone, email, description } = req.body;

    const text = `
    Description: ${description}
    Name: ${name}
    Email: ${email}
    Phone: ${phone}`;


    const apiKey = '4a0aaccc40c608da7ed2fe279933409a-28e9457d-acbaef4d';
    const domain = 'ms.sunrepublic.vip';
    // Mailgun API endpoint for sending emails
    const apiUrl = `https://api.eu.mailgun.net/v3/${domain}/messages`;
    // Email details
    const recipient = RECEIVER_EMAIL;
    const subject = 'New Message';

    // Construct the request payload
    const data = new URLSearchParams();
    data.append('from', SENDER_EMAIL);
    data.append('to', recipient);
    data.append('subject', subject);
    data.append('text', text);

    // Send the email using Axios
    axios.post(apiUrl, data, {
        auth: {
            username: 'api',
            password: apiKey
        }
    })

    res.json({ message: 'sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/*
router.get('/test', async (req, res) => {



// Replace with your Mailgun API key and domain
const apiKey = '4a0aaccc40c608da7ed2fe279933409a-28e9457d-acbaef4d';
const domain = 'ms.sunrepublic.vip';
// Mailgun API endpoint for sending emails
const apiUrl = `https://api.eu.mailgun.net/v3/${domain}/messages`;
// Email details
const recipient = 'abdurrahmantarek2@gmail.com';
const subject = 'New Message';
const text = 'This is a test email sent via Mailgun API.';

// Construct the request payload
const data = new URLSearchParams();
data.append('from', 'no-reply@sunrepublic.vip');
data.append('to', recipient);
data.append('subject', subject);
data.append('text', text);

// Send the email using Axios
axios.post(apiUrl, data, {
    auth: {
        username: 'api',
        password: apiKey
    }
})
.then(response => {
    console.log('Email sent successfully:', response.data);
    	res.json({ok: 'ok'})
})
.catch(error => {
    console.error('Error sending email:', error.response.data);
    	res.json({no: error})
});



})
*/
module.exports = router;

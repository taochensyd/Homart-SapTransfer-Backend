const express = require('express');
const https = require('https');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(index.html);
});

router.post('/saplogin', async (req, res) => {
  console.log("/sap/saplogin")
  if (req.body.password.length > 0) {
      console.log('Logging in with the following details:', req.body);
      const { username, password, database } = req.body;
      const postData = JSON.stringify({
          UserName: username,
          Password: password,
          CompanyDB: database
      });
      try {
          console.log('Sending POST request to https://192.168.0.44:50000/b1s/v1/Login');
          const response = await axios.post('https://192.168.0.44:50000/b1s/v1/Login', postData, {
              headers: {
                  'Content-Type': 'application/json'
              },
              httpsAgent: new https.Agent({
                  rejectUnauthorized: false
              })
          });
          console.log('Received response from POST request:', response.data);
          if (response.status === 200) {
              const result = response.data;
              console.log(`Successful login by user ${username}, with SessionId ${result.SessionId}`);
              req.session.loggedIn = true;
              req.session.username = result.SessionId;
              res.send(`
                <html>
                  <head>
                    <title>SAP Login</title>
                  </head>
                  <body>
                    Successfully logged in!
                  </body>
                </html>
              `);
          }
      } catch (error) {
          console.error('Error occurred while sending POST request:', error);
      }
  }
});

router.post('/saplogout', async (req, res) => {
    try {
        const response = await axios.post('https://192.168.0.44:50000/b1s/v1/Logout', null, {
            headers: {
                'Content-Type': 'application/json',
                Cookie: `B1SESSION=${req.session.username}`
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        if (response.status === 200) {
            req.session.loggedIn = false;
            req.session.username = null;
            res.send(`
        <html>
          <head>
            <title>SAP Logout</title>
          </head>
          <body>
            <h1>You have been logged out</h1>
          </body>
        </html>
      `);
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
module.exports = router;
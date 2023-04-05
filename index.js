const express = require("express");
const sapRouter = require("./components/sap");
const bodyParser = require("body-parser");
const axios = require("axios");
const https = require("https");
const cors = require('cors')

const app = express();
const port = 3002;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());

app.get("/", (req, res) => {
  res.send();
});

app.post("/sap/saplogin", async (req, res) => {
  // [Previous /sap/saplogin code]
  console.log("/sap/saplogin");
  console.log("Logging in with the following details:", req.body);
  const postData = JSON.stringify({
    UserName: req.body.UserName,
    Password: req.body.Password,
    CompanyDB: req.body.CompanyDB,
  });
  console.log("postdata", req.body);
  try {
    console.log(
      "Sending POST request to https://192.168.0.44:50000/b1s/v1/Login"
    );
    const response = await axios.post(
      "https://192.168.0.44:50000/b1s/v1/Login",
      postData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );
    console.log("After axios.post");
    console.log("Received response from POST request:", response.data);
    if (response.status === 200) {
      const result = response.data;
      console.log(result);
      console.log(
        `Successful login by user ${req.body.UserName}, with SessionId ${result.SessionId}`
      );
      res.send(response.data);
    }
  } catch (error) {
    console.error("Error occurred while sending POST request:", error);
    res.sendStatus(500);
  }
});

// app.post("/sap/saplogin", async (req, res) => {
//   // [Previous /sap/saplogin code]
// });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

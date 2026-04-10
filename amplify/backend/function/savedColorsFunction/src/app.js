/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * get method *
 **********************/

app.get('/users/me/savedColors', function (req, res) {
  try {
    const userID = req.apiGateway.event.requestContext.identity.cognitoIdentityId;  // cognito identity id


    // Mock database to be changed later
    const mockColors = [
      { id: "1", userID: userID, name: "Ocean Blue", family: "Blue", hex: "#0077FF", createdAt: "2024-04-01T12:00:00Z" },
      { id: "2", userID: userID, name: "Sunset Orange", family: "Orange", hex: "#FF7700", createdAt: "2024-04-02T13:00:00Z" },
      { id: "3", userID: userID, name: "Forest Green", family: "Green", hex: "#228B22", createdAt: "2024-04-03T14:00:00Z" },
      { id: "4", userID: userID, name: "Royal Purple", family: "Purple", hex: "#7851A9", createdAt: "2024-04-04T15:00:00Z" },
      { id: "5", userID: userID, name: "Cloud White", family: "White", hex: "#F5F5F5", createdAt: "2024-04-05T16:00:00Z" }
    ];

    console.log("Serving mock colors for user:", userID);
    res.json(mockColors); //shows mock saved colors
  } catch (error) {
    console.error("GET Colors Error:", error);
    res.status(500).json({ error: "Failed to fetch saved colors", details: error.message });
  }
});


/****************************
* post method *
****************************/

app.post('/users/me/savedColors', function (req, res) {
  try {
    const userID = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
    const colorData = req.body;

    // instead of writing data to dynamoDB, we will pretend it succeeded
    const fakeSaved = {
      id: "999",
      userID: userID,
      ...colorData,
      createdAt: new Date().toISOString()
    };

    res.json({ success: "Mock color saved", color: fakeSaved });
  } catch (error) {
    res.status(500).json({ error: "Failed to save color", details: error });
  }
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application locally this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

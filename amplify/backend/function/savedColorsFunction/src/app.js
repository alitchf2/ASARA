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
const crypto = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

// DynamoDB connection
const client = new DynamoDBClient({ region: process.env.REGION || "us-east-2" });
const dynamo = DynamoDBDocumentClient.from(client);
const env = process.env.ENV || "dev";
const TABLE_NAME = `colorfind-objects-${env}`;

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
 * GET method *
 **********************/
app.get('/users/me/savedColors', async function (req, res) {
  try {
    const userID = req.apiGateway.event.requestContext.identity.cognitoIdentityId; // Safe Handshake

    // Ask DynamoDB for saved colors
    const data = await dynamo.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userID = :u",
      ExpressionAttributeValues: { ":u": userID }
    }));

    console.log(`Fetched ${data.Items.length} colors for user: ${userID}`);
    res.json(data.Items || []); 

  } catch (error) {
    console.error("GET Colors Error:", error);
    res.status(500).json({ error: "Failed to fetch saved colors", details: error.message });
  }
});

/****************************
* POST method *
****************************/
app.post('/users/me/savedColors', async function (req, res) {
  try {
    const userID = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
    const colorData = req.body;

    const newColor = {
      userID: userID,
      objectID: crypto.randomUUID(),
      ...colorData,
      createdAt: new Date().toISOString()
    };

    await dynamo.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: newColor
    }));

    res.json({ success: "Color saved", color: newColor });

  } catch (error) {
    console.log("POST Colors Error:", error);
    res.status(500).json({ error: "Failed to save color", details: error.message });
  }
});

app.listen(3000, function () {
  console.log("App started")
});

module.exports = app;

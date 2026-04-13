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
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// AWS connection
const region = process.env.REGION || "us-east-2";
const client = new DynamoDBClient({ region });
const dynamo = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region });

const env = process.env.ENV || "dev";
const TABLE_NAME = `colorfind-objects-${env}`;
// Use the exact bucket names provided (handling the Amplify unique hashes)
const BUCKET_NAME = env === "prod" 
  ? "colorfind-images-devede92-prod" 
  : "colorfind-images-dev8b035-dev";

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

    let items = data.Items || [];
    
    // Generate secure View URLs for every image (stays on Lambda server, fast math)
    const itemsWithUrls = await Promise.all(items.map(async (item) => {
      if (item.imageS3Key) {
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.imageS3Key,
        });
        // Generate a 60-minute expiring link
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { ...item, imageUri: signedUrl };
      }
      return item;
    }));

    itemsWithUrls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("-> DynamoDB Query Success", itemsWithUrls.length);
    res.json(itemsWithUrls);

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

/****************************
* S3 Upload URL method *
****************************/
app.post('/users/me/savedColors/upload-url', async function (req, res) {
  try {
    const userID = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
    const { fileType } = req.body; // e.g., 'image/jpeg'
    
    const objectID = crypto.randomUUID();
    const s3Key = `public/${userID}/${objectID}.jpg`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType || 'image/jpeg'
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minute window

    res.json({ uploadUrl, s3Key });

  } catch (error) {
    console.error("S3 Upload URL Error:", error);
    res.status(500).json({ error: "Failed to generate upload URL", details: error.message });
  }
});

app.listen(3000, function () {
  console.log("App started")
});

module.exports = app;

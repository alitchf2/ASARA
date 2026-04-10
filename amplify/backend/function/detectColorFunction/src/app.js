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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/colors/detect', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/colors/detect/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Cached Color Match Method *
****************************/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'colorfind-colors-master-dev';

// In-memory cache outside the handler to persist across warm invocations
let colorsCache = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 3600000; // 1 hour

async function fetchAllColors() {
  if (colorsCache && (Date.now() - lastCacheUpdate < CACHE_TTL)) {
    return colorsCache;
  }
  
  let allItems = [];
  let params = { TableName: TABLE_NAME };
  let result;
  
  do {
    result = await docClient.send(new ScanCommand(params));
    if (result.Items) {
      allItems = allItems.concat(result.Items);
    }
    params.ExclusiveStartKey = result.LastEvaluatedKey;
  } while (result.LastEvaluatedKey);
  
  colorsCache = allItems;
  lastCacheUpdate = Date.now();
  
  return colorsCache;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function calculateRgbDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt(
    Math.pow(r1 - r2, 2) + 
    Math.pow(g1 - g2, 2) + 
    Math.pow(b1 - b2, 2)
  );
}

app.post('/colors/detect/match', async function(req, res) {
  try {
    const { hexColor } = req.body;
    if (!hexColor) {
      return res.status(400).json({ error: 'hexColor is required' });
    }
    
    const targetRgb = hexToRgb(hexColor);
    if (!targetRgb) {
      return res.status(400).json({ error: 'Invalid hex format' });
    }
    
    const colors = await fetchAllColors();
    
    let closestColor = null;
    let minDistance = Infinity;
    
    for (const color of colors) {
      if (!color.rgb) continue;
      
      const r = Number(color.rgb.r);
      const b = Number(color.rgb.b);
      const g = Number(color.rgb.g);
      
      if (isNaN(r) || isNaN(g) || isNaN(b)) continue;
      
      const distance = calculateRgbDistance(targetRgb.r, targetRgb.g, targetRgb.b, r, g, b);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
    
    res.json({ success: true, closestColor });
  } catch (err) {
    console.error("Match error:", err);
    res.status(500).json({ error: err.message });
  }
});

/****************************
* Example put method *
****************************/

app.put('/colors/detect', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/colors/detect/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/colors/detect', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/colors/detect/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

/*
  savedColorsFunction — app.js
  Handles all /users/me/savedColors routes.

  Routes:
    GET  /users/me/savedColors              → List all colors for the signed-in user
    POST /users/me/savedColors              → Save a new color record to DynamoDB
    POST /users/me/savedColors/upload-url   → Generate a presigned S3 PUT URL for image upload
*/

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { randomUUID } = require('crypto');

// ── AWS Clients ────────────────────────────────────────────────────────────────
const REGION = process.env.REGION || 'us-east-2';
const ENV    = process.env.ENV    || 'dev';

const dynamoClient = new DynamoDBClient({ region: REGION });
const dynamo       = DynamoDBDocumentClient.from(dynamoClient);
const s3           = new S3Client({ region: REGION });

// ── Resource Names ─────────────────────────────────────────────────────────────
// DynamoDB table — partition key: userID (S), sort key: objectID (S)
const TABLE_NAME  = `colorfind-objects-${ENV}`;

// S3 bucket — dev has a hash suffix; prod does not
// Falls back to env var IMAGES_BUCKET if set (useful for future envs)
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || (
  ENV === 'prod'
    ? 'colorfind-images-prod'
    : 'colorfind-images-dev8b035-dev'
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

function respond(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

function getUserID(event) {
  // SigV4/IAM auth via Cognito Identity Pool: the Cognito sub is embedded in
  // cognitoAuthenticationProvider as "...POOL_ID:CognitoSignIn:USER_SUB"
  const provider = event.requestContext?.identity?.cognitoAuthenticationProvider;
  if (provider) {
    const parts = provider.split(':CognitoSignIn:');
    if (parts.length > 1) return parts[parts.length - 1].trim();
  }
  // Fallback: Cognito User Pool authorizer (if API auth is ever reconfigured)
  return event.requestContext?.authorizer?.claims?.sub || null;
}

// ── Handler ────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  try {
  console.log('savedColorsFunction invoked:', JSON.stringify({
    method: event.httpMethod,
    path:   event.path,
    user:   event.requestContext?.authorizer?.claims?.sub,
  }));

  const method = event.httpMethod;
  const path   = event.path || '';

  console.log(`DEBUG: Method=${method}, Path=${path}`);

  // Allow CORS preflight
  if (method === 'OPTIONS') return respond(200, {});

  // ── POST /users/me/savedColors ─────────────────────────────────────────────
  if (method === 'POST') {
    const userID = getUserID(event);
    if (!userID) return respond(401, { error: 'Unauthorized' });

    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch {
      return respond(400, { error: 'Invalid JSON body' });
    }

    // --- Sub-Action: Generate Upload URL (Ticket) ---
    if (body.action === 'getUploadUrl') {
      console.log(`Generating upload ticket for user ${userID}`);
      const fileType = body.fileType || 'image/jpeg';
      const objectID = randomUUID(); // If randomUUID fails, we'll see it in logs
      const s3Key    = `users/${userID}/${objectID}.jpg`;

      const uploadUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket:      IMAGES_BUCKET,
          Key:         s3Key,
          ContentType: fileType,
        }),
        { expiresIn: 300 }
      );

      return respond(200, { uploadUrl, s3Key, objectID });
    }

    // --- Default Action: Save Color Profile ---
    const { name, hex, family, imageS3Key } = body;

    if (!name || !hex) {
      return respond(400, { error: 'name and hex are required' });
    }

    const objectID  = randomUUID();
    const createdAt = new Date().toISOString();

    const item = {
      userID,
      objectID,
      name:       name.trim(),
      hex:        hex.startsWith('#') ? hex : `#${hex}`,
      family:     family || 'Unknown',
      imageS3Key: imageS3Key || null,
      createdAt,
    };

    await dynamo.send(new PutCommand({
      TableName: TABLE_NAME,
      Item:      item,
    }));

    console.log(`Saved color ${objectID} for user ${userID}`);
    return respond(201, { success: true, objectID });
  }

  // ── GET /users/me/savedColors ──────────────────────────────────────────────
  if (method === 'GET') {
    const userID = getUserID(event);
    if (!userID) return respond(401, { error: 'Unauthorized' });

    // Query all items for this user (partition key = userID)
    const result = await dynamo.send(new QueryCommand({
      TableName:                TABLE_NAME,
      KeyConditionExpression:   'userID = :uid',
      ExpressionAttributeValues: { ':uid': userID },
      ScanIndexForward:         false, // newest first (by sort key lexicographic order with UUID)
    }));

    const items = result.Items || [];

    // For each item with an imageS3Key, generate a short-lived presigned GET URL
    const colors = await Promise.all(
      items.map(async (item) => {
        let imageUri = null;

        if (item.imageS3Key) {
          try {
            imageUri = await getSignedUrl(
              s3,
              new GetObjectCommand({
                Bucket: IMAGES_BUCKET,
                Key:    item.imageS3Key,
              }),
              { expiresIn: 3600 } // 1 hour
            );
          } catch (err) {
            console.warn(`Failed to generate presigned URL for ${item.imageS3Key}:`, err.message);
          }
        }

        return {
          id:         item.objectID,
          name:       item.name,
          hex:        item.hex,
          family:     item.family,
          imageUri,
          createdAt:  item.createdAt,
        };
      })
    );

    console.log(`Returning ${colors.length} colors for user ${userID}`);
    return respond(200, colors);
  }

  return respond(405, { error: 'Method not allowed' });
  } catch (err) {
    console.error("UNHANDLED LAMBDA EXCEPTION:", err);
    return respond(500, {
      error: "Internal Server Error",
      message: err.message,
      stack: err.stack 
    });
  }
};

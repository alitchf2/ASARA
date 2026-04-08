const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.REGION || "us-east-2" });
const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "colorfind-users-dev";

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
};

function respond(statusCode, body) {
    return { statusCode, headers, body: JSON.stringify(body) };
}

/**
 * UpdateUserProfile Lambda — triggered via API Gateway proxy
 *
 * PATCH /users/me
 * Body: { newUsername: string }
 * Auth: Cognito User Pool (userID extracted from JWT claims — never trusted from client)
 */
exports.handler = async (event) => {
    console.log("UpdateUserProfile invoked:", JSON.stringify(event));

    const method = event.httpMethod;
    if (method === "OPTIONS") return respond(200, {});

    if (method !== "PUT") return respond(405, { error: "Method not allowed" });

    // ── Extract userID from verified Cognito JWT claims ───────────────────────
    const userID = event.requestContext?.authorizer?.claims?.sub;
    if (!userID) return respond(401, { error: "Unauthorized" });

    // ── Parse and validate body ───────────────────────────────────────────────
    let body;
    try {
        body = JSON.parse(event.body || "{}");
    } catch {
        return respond(400, { error: "Invalid JSON body" });
    }

    const newUsername = (body.newUsername || "").trim();
    if (!newUsername) return respond(400, { error: "INVALID_INPUT" });

    // ── Username availability check via GSI ───────────────────────────────────
    const existing = await dynamo.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "username-index",
        KeyConditionExpression: "username = :u",
        ExpressionAttributeValues: { ":u": newUsername },
        Limit: 1,
    }));

    if (existing.Items?.length > 0 && existing.Items[0].userID !== userID) {
        return respond(409, { success: false, error: "USERNAME_TAKEN" });
    }

    // ── Upsert Users record ───────────────────────────────────────────────────
    const now = new Date().toISOString();
    await dynamo.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userID },
        UpdateExpression: "SET username = :username, createdAt = if_not_exists(createdAt, :now)",
        ExpressionAttributeValues: { ":username": newUsername, ":now": now },
    }));

    console.log(`Updated username for ${userID} → ${newUsername}`);
    return respond(200, { success: true });
};

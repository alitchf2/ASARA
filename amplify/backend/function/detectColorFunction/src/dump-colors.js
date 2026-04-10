const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const fs = require("fs");

const REGION = "us-east-2"; 
const TABLE_NAME = "colorfind-colors-master-dev";

process.env.AWS_PROFILE = 'colorfind';

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function dumpTable() {
    try {
        console.log(`Starting dump of ${TABLE_NAME}...`);
        let allItems = [];
        let params = { TableName: TABLE_NAME };
        let result;
        
        do {
            result = await docClient.send(new ScanCommand(params));
            if (result.Items) {
                allItems = allItems.concat(result.Items);
            }
            params.ExclusiveStartKey = result.LastEvaluatedKey;
            console.log(`Fetched ${allItems.length} items so far...`);
        } while (result.LastEvaluatedKey);
        
        fs.writeFileSync("./colors.json", JSON.stringify(allItems));
        console.log(`Successfully dumped ${allItems.length} records into colors.json! File size: ${fs.statSync('./colors.json').size} bytes.`);
    } catch (e) {
        console.error("Error dumping table", e);
    }
}

dumpTable();

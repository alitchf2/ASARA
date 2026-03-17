import { ENV } from "./index";

export function validateEnvOrThrow() {
  const missing: string[] = [];

  if (!ENV.apiBaseUrl) missing.push("apiBaseUrl");

  if (!ENV.dynamodb.usersTableName) missing.push("dynamodb.usersTableName");
  if (!ENV.dynamodb.objectsTableName) missing.push("dynamodb.objectsTableName");
  if (!ENV.dynamodb.colorsMasterTableName)
    missing.push("dynamodb.colorsMasterTableName");

  if (!ENV.s3.imagesBucketName) missing.push("s3.imagesBucketName");

  if (!ENV.cognito.userPoolId) missing.push("cognito.userPoolId");
  if (!ENV.cognito.userPoolClientId) missing.push("cognito.userPoolClientId");

  if (missing.length > 0) {
    throw new Error(
      `[Colorfind] Missing environment config values: ${missing.join(", ")}`,
    );
  }
}

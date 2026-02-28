import { EnvConfig, withEnvSuffix } from "./env.types";

export const envDev: EnvConfig = {
  env: "dev",

  apiBaseUrl: "https://api.colorfind.app/dev/",

  dynamodb: {
    usersTableName: withEnvSuffix("colorfind-users", "dev"),
    objectsTableName: withEnvSuffix("colorfind-objects", "dev"),
    colorsMasterTableName: "colorfind-colors-master",
  },

  s3: {
    imagesBucketName: withEnvSuffix("colorfind-images", "dev"),
  },

  cognito: {
    userPoolId: "REPLACE_ME_DEV_USER_POOL_ID",
    userPoolClientId: "REPLACE_ME_DEV_USER_POOL_CLIENT_ID",
    identityPoolId: "REPLACE_ME_DEV_IDENTITY_POOL_ID",
  },
};
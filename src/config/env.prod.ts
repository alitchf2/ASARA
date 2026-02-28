import { EnvConfig, withEnvSuffix } from "./env.types";

export const envProd: EnvConfig = {
  env: "prod",

  apiBaseUrl: "https://api.colorfind.app/prod/",

  dynamodb: {
    usersTableName: withEnvSuffix("colorfind-users", "prod"),
    objectsTableName: withEnvSuffix("colorfind-objects", "prod"),
    colorsMasterTableName: "colorfind-colors-master",
  },

  s3: {
    imagesBucketName: withEnvSuffix("colorfind-images", "prod"),
  },

  cognito: {
    userPoolId: "REPLACE_ME_PROD_USER_POOL_ID",
    userPoolClientId: "REPLACE_ME_PROD_USER_POOL_CLIENT_ID",
    identityPoolId: "REPLACE_ME_PROD_IDENTITY_POOL_ID",
  },
};
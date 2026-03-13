export type AppEnvName = "dev" | "prod";

export type EnvConfig = {
  env: AppEnvName;

  apiBaseUrl: string;

  dynamodb: {
    usersTableName: string;
    objectsTableName: string;
    // NOTE: colors-master is not env-specific in your tasks.md, so no -dev/-prod
    colorsMasterTableName: string;
  };

  s3: {
    imagesBucketName: string;
  };

  cognito: {
    userPoolId: string;
    userPoolClientId: string;
    identityPoolId?: string;
  };
};

export const withEnvSuffix = (base: string, env: AppEnvName) =>
  `${base}-${env}`;

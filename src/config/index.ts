import type { AppEnvName, EnvConfig } from "./env.types";
import { envDev } from "./env.dev";
import { envProd } from "./env.prod";

/**
 * Controlled via:
 * EXPO_PUBLIC_APP_ENV=dev
 * EXPO_PUBLIC_APP_ENV=prod
 */

const raw = process.env.EXPO_PUBLIC_APP_ENV;

const envName: AppEnvName = raw === "prod" ? "prod" : "dev";

const map: Record<AppEnvName, EnvConfig> = {
  dev: envDev,
  prod: envProd,
};

export const ENV: EnvConfig = map[envName];

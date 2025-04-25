import dotenv from "dotenv";
const dotenvResult = dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
if (dotenvResult.error) {
  throw dotenvResult.error;
}

// exporting all the environment variables

export const ENV_PORT = process.env.PORT;
export const ENV_NODE_ENV = process.env.NODE_ENV;
export const ENV_FE_BASE_URL = process.env.FE_BASE_URL;

export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB_NAME = process.env.MONOG_DB_NAME;

export const ENV_DB_NAME = process.env.DB_NAME;
export const ENV_DB_USER = process.env.DB_USER;
export const ENV_DB_HOST = process.env.DB_HOST;
export const ENV_DB_PASSWORD = process.env.DB_PASSWORD;
export const ENV_DB_PORT = process.env.DB_PORT;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_USER = process.env.REDIS_USER;

export const ENV_ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const ENV_ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const ENV_GRAM_EMAIL = process.env.GRAM_EMAIL;
export const ENV_GRAM_PASSWORD = process.env.GRAM_PASSWORD;
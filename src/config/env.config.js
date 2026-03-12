import dotenv from "dotenv";

dotenv.config({quiet: true});

export const env = {
  PORT: Number(process.env.PORT) || 8080,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/adoptme",
  DB_NAME: process.env.DB_NAME || "adoptme",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access-secret-dev",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh-secret-dev",
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  PERSISTENCE: (process.env.PERSISTENCE || "memory").toLowerCase(),
  NODE_ENV: process.env.NODE_ENV || "development",
  RATE_LIMIT_WINDOW_MINUTES: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 5,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 30,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  APP_BASE_URL: process.env.APP_BASE_URL || "http://localhost:8080",
  RESET_TOKEN_TTL_MINUTES: Number(process.env.RESET_TOKEN_TTL_MINUTES) || 15,
};

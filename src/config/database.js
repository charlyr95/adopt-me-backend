import mongoose from "mongoose";
import { env } from "./env.config.js";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  if (env.PERSISTENCE !== "mongo") {
    logger.info(
      `Skipping MongoDB connection. Using persistence: ${env.PERSISTENCE}`,
    );
    return;
  }

  await mongoose.connect(env.MONGO_URI, { dbName: env.DB_NAME });
  logger.info("MongoDB connected");
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  }
};

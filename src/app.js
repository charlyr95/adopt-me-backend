import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors";
import { corsConfig } from "./config/cors.config.js";
import { initializePassport } from "./config/passport.config.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/_index.js";
import { swaggerSpec } from "./docs/swagger/swagger.js";
import { successResponse } from "./dto/response.dto.js";
import { apiRateLimiter } from "./config/rate-limit.config.js";
import { env } from "./config/env.config.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsConfig));
app.use("/uploads", express.static(path.resolve(process.cwd(), "data", "uploads")));

if (env.NODE_ENV !== "test") {
  app.use(loggerMiddleware);
  app.use(apiRateLimiter);
}

initializePassport(passport);
app.use(passport.initialize());
app.use("/api", apiRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

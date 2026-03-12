import rateLimit from "express-rate-limit";
import { env } from "./env.config.js";
import { errorResponse } from "../dto/response.dto.js";

const windowMs = env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

export const apiRateLimiter = rateLimit({
  windowMs,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("Too many requests, please try again later.", ["Rate limit exceeded"]),
});

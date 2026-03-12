import { successResponse } from "../dto/response.dto.js";

export const healthCheck = (req, res) => {
  res.json(
    successResponse("API is running", {
      uptime: process.uptime(),
      cpu: process.cpuUsage() || null,
      memory: process.memoryUsage() || null,
      timestamp: new Date().toISOString(),
    }),
  );
};

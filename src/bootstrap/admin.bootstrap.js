import crypto from "crypto";
import { userService } from "../services/user.service.js";
import { userRepository } from "../repositories/_index.js";
import { logger } from "../utils/logger.js";

const generateRandomPassword = () => {
  const raw = crypto.randomBytes(6).toString("base64url");
  return `Adm!${raw}`;
};

const generateAdminEmail = () => `admin@test.com`;

export const ensureBootstrapAdminUser = async () => {
  const admins = await userRepository.getAll({ role: "admin" });
  if (admins.length > 0) {
    return;
  }

  const generatedPassword = generateRandomPassword();
  const payload = {
    first_name: "System",
    last_name: "Admin",
    email: generateAdminEmail(),
    password: generatedPassword,
    role: "admin",
  };

  const adminUser = await userService.create(payload);

  logger.warn("No admin user found. Auto-generated bootstrap admin user.");
  logger.warn("AUTO-GENERATED ADMIN USER:", { email: adminUser.email, password: generatedPassword });
};

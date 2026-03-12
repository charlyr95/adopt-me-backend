import { userRepository } from "../repositories/_index.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { UserResponseDTO } from "../dto/user.dto.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  createResetToken,
  consumeResetToken,
  getResetTokenUserId,
} from "../utils/password-reset.store.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import { env } from "../config/env.config.js";

export class AuthService {
  async register(payload) {
    const existing = await userRepository.getByEmail(payload.email);
    if (existing) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await hashPassword(payload.password);
    const userHashed = { ...payload, password: hashedPassword, role: "user" };
    const user = await userRepository.create(userHashed);
    const userDTO = new UserResponseDTO(user);
    return this.buildAuthPayload(userDTO);
  }

  buildAuthPayload(userDTO) {
    return {
      accessToken: signAccessToken(userDTO),
      refreshToken: signRefreshToken(userDTO),
      user: userDTO,
    };
  }

  async refreshAccessToken(token) {
    const payload = verifyRefreshToken(token);
    const user = await userRepository.getById(payload.sub);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const userDTO = new UserResponseDTO(user);
    return {
      accessToken: signAccessToken(userDTO),
    };
  }

  async requestPasswordReset(email, baseUrl) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return;
    }
    const userDTO = new UserResponseDTO(user);
    const ttlMs = env.RESET_TOKEN_TTL_MINUTES * 60 * 1000;
    const token = createResetToken(userDTO.id, ttlMs);
    await sendPasswordResetEmail(userDTO.email, token, baseUrl);
  }

  async resetPassword(token, newPassword) {
    if (!token) {
      const error = new Error("reset token is required");
      error.statusCode = 400;
      throw error;
    }

    if (!newPassword) {
      const error = new Error("password is required");
      error.statusCode = 400;
      throw error;
    }

    const userId = getResetTokenUserId(token);
    if (!userId) {
      const error = new Error("Invalid or expired reset token");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.getById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (
      user.password !== undefined &&
      user.password !== null &&
      user.password !== ""
    ) {
      const isSamePassword = await verifyPassword(user.password, newPassword);
      if (isSamePassword) {
        const error = new Error("New password must be different from the current password");
        error.statusCode = 400;
        throw error;
      }
    }

    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await userRepository.updateById(userId, {
      password: hashedPassword,
    });
    if (!updatedUser) {
      const error = new Error("Failed to update password");
      error.statusCode = 500;
      throw error;
    }

    consumeResetToken(token);
  }
}

export const authService = new AuthService();

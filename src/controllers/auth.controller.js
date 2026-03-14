import passport from "passport";
import { authService } from "../services/auth.service.js";
import { successResponse } from "../dto/response.dto.js";
import { UserResponseDTO } from "../dto/user.dto.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../config/cookie.config.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    // Set tokens in HTTP-only cookies
    res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

    res
      .status(201)
      .json(successResponse("User registered successfully", result));
  } catch (error) {
    next(error);
  }
};

export const login = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) return next(err);
        if (!user) {
          const error = new Error(info?.message || "Invalid credentials");
          error.statusCode = 401;
          throw error;
        }
        const updatedUser = await authService.touchLastConnection(user.id || user._id);
        const userDTO = new UserResponseDTO(updatedUser || user);
        const result = authService.buildAuthPayload(userDTO);

        // Set tokens in HTTP-only cookies
        res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
        res.cookie(
          "refreshToken",
          result.refreshToken,
          refreshTokenCookieOptions,
        );

        res.json(successResponse("Login successful", result));
      } catch (error) {
        next(error);
      }
    },
  )(req, res, next);
};

export const refresh = async (req, res, next) => {
  try {
    // Get refreshToken from body or cookie
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      const error = new Error("refreshToken is required");
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    // Set new accessToken in HTTP-only cookie
    res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);

    res.json(successResponse("Token refreshed", result));
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message = "Invalid or expired refresh token";
    }

    next(error);
  }
};

export const currentUser = async (req, res) => {
  const userDTO = new UserResponseDTO(req.user);
  res.json(successResponse("Current user fetched", userDTO));
};

export const logout = async (req, res) => {
  await authService.touchLastConnection(req.user?.id || req.user?._id);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json(successResponse("Logged out successfully", {}));
};

export const forgotPassword = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    await authService.requestPasswordReset(req.body.email, baseUrl);
    res.json(successResponse("If the email exists, a reset link was sent"));
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const token = req.query.token || undefined;
    const { password = undefined } = req.body;
    await authService.resetPassword(token, password);
    res.json(successResponse("Password updated successfully", {}));
  } catch (error) {
    next(error);
  }
};

import crypto from "crypto";

const tokens = new Map();

const purgeIfExpired = (token, entry) => {
  if (!entry) return true;
  if (Date.now() > entry.expiresAt) {
    tokens.delete(token);
    return true;
  }
  return false;
};

export const createResetToken = (userId, ttlMs) => {
  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, { userId, expiresAt: Date.now() + ttlMs });
  return token;
};

export const getResetTokenUserId = (token) => {
  const entry = tokens.get(token);
  if (!entry || purgeIfExpired(token, entry)) {
    return null;
  }

  return entry.userId;
};

export const consumeResetToken = (token) => {
  const entry = tokens.get(token);
  if (!entry || purgeIfExpired(token, entry)) {
    return null;
  }

  tokens.delete(token);
  return entry.userId;
};

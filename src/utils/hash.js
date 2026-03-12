import argon2 from "argon2";

export const hashPassword = async (plainPassword) => {
  if (!plainPassword) throw new Error("Password is required for hashing");
  return await argon2.hash(plainPassword);
};

export const verifyPassword = async (hash, plainPassword) => {
  if (!hash) return false;
  if (!plainPassword) return false;
  return await argon2.verify(hash, plainPassword);
};

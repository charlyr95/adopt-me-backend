import { userRepository } from "../repositories/_index.js";
import { hashPassword } from "../utils/hash.js";
import { UserResponseDTO, UserCreateDTO, UserResponseListDTO } from "../dto/user.dto.js";

export class UserService {
  async create(payload) {
    const existing = await userRepository.getByEmail(payload.email);
    if (existing) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await hashPassword(payload.password);
    const userDTO = new UserCreateDTO({ ...payload, password: hashedPassword });
    return new UserResponseDTO(await userRepository.create(userDTO));
  }

  async createMany(payloads) {
    if (!Array.isArray(payloads) || payloads.length === 0) {
      const error = new Error("Payload must be a non-empty array");
      error.statusCode = 400;
      throw error;
    }

    const emails = payloads.map((payload) => payload.email).filter(Boolean);
    const seen = new Set();
    for (const email of emails) {
      if (seen.has(email)) {
        const error = new Error("Duplicate email in payload");
        error.statusCode = 409;
        throw error;
      }
      seen.add(email);
    }

    for (const email of emails) {
      const existing = await userRepository.getByEmail(email);
      if (existing) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
      }
    }

    const userDTOs = await Promise.all(
      payloads.map(async (payload) => {
        const hashedPassword = await hashPassword(payload.password);
        return new UserCreateDTO({ ...payload, password: hashedPassword });
      })
    );

    const users = await userRepository.createMany(userDTOs);
    return UserResponseListDTO(users);
  }

  async getAll(filters = {}, options = {}) {
    const result = await userRepository.getAll(filters, options);

    if (options.page && options.limit) {
      return {
        data: UserResponseListDTO(result.data),
        meta: {
          page: options.page,
          limit: options.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / options.limit)
        }
      };
    }

    return UserResponseListDTO(result);
  }

  async getById(id) {
    const user = await userRepository.getById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return new UserResponseDTO(user);
  }

  async updateById(id, payload) {
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    const updated = await userRepository.updateById(id, payload);
    if (!updated) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return new UserResponseDTO(updated);
  }

  async deleteById(id) {
    const deleted = await userRepository.deleteById(id);
    if (!deleted) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return new UserResponseDTO(deleted);
  }
}

export const userService = new UserService();

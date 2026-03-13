import { petRepository } from '../repositories/_index.js';
import { PetResponseDTO, PetCreateDTO, PetUpdateDTO, PetResponseListDTO } from '../dto/pet.dto.js';

export class PetService {
  async create(payload) {
    return petRepository.create(new PetCreateDTO(payload));
  }

  async createMany(payloads) {
    if (!Array.isArray(payloads) || payloads.length === 0) {
      const error = new Error('Payload must be a non-empty array');
      error.statusCode = 400;
      throw error;
    }

    const created = await petRepository.createMany(
      payloads.map((payload) => new PetCreateDTO(payload))
    );
    return PetResponseListDTO(created);
  }

  async getAll(filters = {}, options = {}) {
    const result = await petRepository.getAll(filters, options);

    if (options.page && options.limit) {
      return {
        data: PetResponseListDTO(result.data),
        meta: {
          page: options.page,
          limit: options.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / options.limit)
        }
      };
    }

    return PetResponseListDTO(result);
  }

  async getById(id) {
    const pet = await petRepository.getById(id);
    if (!pet) {
      const error = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }
    return new PetResponseDTO(pet);
  }

  async updateById(id, payload) {
    const updated = await petRepository.updateById(id, new PetUpdateDTO(payload));
    if (!updated) {
      const error = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }

    return updated;
  }

  async deleteById(id) {
    const deleted = await petRepository.deleteById(id);
    if (!deleted) {
      const error = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }

    return deleted;
  }
}

export const petService = new PetService();

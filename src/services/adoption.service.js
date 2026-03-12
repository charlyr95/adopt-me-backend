import { adoptionRepository, petRepository, userRepository } from '../repositories/_index.js';

export class AdoptionService {
  async createMany(payloads) {
    if (!Array.isArray(payloads) || payloads.length === 0) {
      const error = new Error('Payload must be a non-empty array');
      error.statusCode = 400;
      throw error;
    }

    return adoptionRepository.createMany(payloads);
  }

  async createAdoption(ownerId, petId) {
    const user = await userRepository.getById(ownerId);
    if (!user) {
      const error = new Error('Owner not found');
      error.statusCode = 404;
      throw error;
    }

    const pet = await petRepository.getById(petId);
    if (!pet) {
      const error = new Error('Pet not found');
      error.statusCode = 404;
      throw error;
    }

    if (pet.status !== 'available') {
      const error = new Error('Pet is not available for adoption');
      error.statusCode = 409;
      throw error;
    }

    const updatedPet = await petRepository.updateById(petId, {
      status: 'adopted',
      owner: ownerId
    });

    await userRepository.addPetToUser(ownerId, petId);

    const adoption = await adoptionRepository.create({
      owner: ownerId,
      pet: petId,
      adoptionDate: new Date().toISOString()
    });

    return { adoption, pet: updatedPet };
  }

  async getAll(filters = {}) {
    return adoptionRepository.getAll(filters);
  }
}

export const adoptionService = new AdoptionService();

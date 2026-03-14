import crypto from 'crypto';
import { memoryStore } from './store.js';
import { caseInsensitiveMatch } from '../../utils/filters.js';

export class PetMemoryDAO {
  async create(petData) {
    const pet = { id: crypto.randomUUID(), status: 'available', owner: null, ...petData };
    memoryStore.pets.push(pet);
    return pet;
  }

  async createMany(petDataList) {
    const pets = petDataList.map((petData) => ({
      id: crypto.randomUUID(),
      status: 'available',
      owner: null,
      ...petData
    }));
    memoryStore.pets.push(...pets);
    return pets;
  }

  async findById(id) {
    return memoryStore.pets.find((pet) => pet.id === id) || null;
  }

  async findOne(filters) {
    return (
      memoryStore.pets.find((pet) =>
        Object.entries(filters).every(([key, value]) => caseInsensitiveMatch(pet[key], value))
      ) || null
    );
  }

  async findAll(filters = {}, { page, limit } = {}) {
    const results = memoryStore.pets.filter((pet) =>
      Object.entries(filters).every(([key, value]) => caseInsensitiveMatch(pet[key], value))
    );
    if (page && limit) {
      const total = results.length;
      const skip = (page - 1) * limit;
      return { data: results.slice(skip, skip + limit), total };
    }
    return results;
  }

  async updateById(id, updateData) {
    const index = memoryStore.pets.findIndex((pet) => pet.id === id);
    if (index === -1) return null;

    memoryStore.pets[index] = { ...memoryStore.pets[index], ...updateData };
    return memoryStore.pets[index];
  }

  async deleteById(id) {
    const index = memoryStore.pets.findIndex((pet) => pet.id === id);
    if (index === -1) return null;

    const [deleted] = memoryStore.pets.splice(index, 1);
    return deleted;
  }
}

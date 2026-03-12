import crypto from 'crypto';
import { memoryStore } from './store.js';

export class AdoptionMemoryDAO {
  async create(adoptionData) {
    const adoption = {
      id: crypto.randomUUID(),
      adoptionDate: new Date().toISOString(),
      ...adoptionData
    };
    memoryStore.adoptions.push(adoption);
    return adoption;
  }

  async createMany(adoptionDataList) {
    const adoptions = adoptionDataList.map((adoptionData) => ({
      id: crypto.randomUUID(),
      adoptionDate: new Date().toISOString(),
      ...adoptionData
    }));
    memoryStore.adoptions.push(...adoptions);
    return adoptions;
  }

  async findById(id) {
    return memoryStore.adoptions.find((adoption) => adoption.id === id) || null;
  }

  async findAll(filters = {}) {
    return memoryStore.adoptions.filter((adoption) =>
      Object.entries(filters).every(([key, value]) => adoption[key] === value)
    );
  }
}

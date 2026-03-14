import crypto from 'crypto';
import { BaseFileDAO } from './base.file.dao.js';
import { caseInsensitiveMatch } from '../../utils/filters.js';

export class PetFileDAO extends BaseFileDAO {
  constructor() {
    super('pets.json');
  }

  async create(petData) {
    const pets = await this._readAll();
    const pet = { id: crypto.randomUUID(), status: 'available', owner: null, ...petData };
    pets.push(pet);
    await this._writeAll(pets);
    return pet;
  }

  async createMany(petDataList) {
    const pets = await this._readAll();
    const created = petDataList.map((petData) => ({
      id: crypto.randomUUID(),
      status: 'available',
      owner: null,
      ...petData
    }));
    pets.push(...created);
    await this._writeAll(pets);
    return created;
  }

  async findById(id) {
    const pets = await this._readAll();
    return pets.find((pet) => pet.id === id) || null;
  }

  async findOne(filters) {
    const pets = await this._readAll();
    return (
      pets.find((pet) =>
        Object.entries(filters).every(([key, value]) => caseInsensitiveMatch(pet[key], value))
      ) || null
    );
  }

  async findAll(filters = {}, { page, limit } = {}) {
    const pets = await this._readAll();
    const results = pets.filter((pet) =>
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
    const pets = await this._readAll();
    const index = pets.findIndex((pet) => pet.id === id);

    if (index === -1) return null;

    pets[index] = { ...pets[index], ...updateData };
    await this._writeAll(pets);
    return pets[index];
  }

  async deleteById(id) {
    const pets = await this._readAll();
    const index = pets.findIndex((pet) => pet.id === id);

    if (index === -1) return null;

    const [deleted] = pets.splice(index, 1);
    await this._writeAll(pets);
    return deleted;
  }
}

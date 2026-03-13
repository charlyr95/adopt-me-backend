import { mapEntity } from './mapper.js';

export class PetRepository {
  constructor(petDAO) {
    this.petDAO = petDAO;
  }

  async create(petData) {
    const pet = await this.petDAO.create(petData);
    return mapEntity(pet);
  }

  async createMany(petDataList) {
    const pets = await this.petDAO.createMany(petDataList);
    return pets.map(mapEntity);
  }

  async getById(id) {
    const pet = await this.petDAO.findById(id);
    return mapEntity(pet);
  }

  async getAll(filters = {}, options = {}) {
    const result = await this.petDAO.findAll(filters, options);
    if (result && result.data) {
      return { data: result.data.map(mapEntity), total: result.total };
    }
    return result.map(mapEntity);
  }

  async updateById(id, updateData) {
    const updated = await this.petDAO.updateById(id, updateData);
    return mapEntity(updated);
  }

  async deleteById(id) {
    const deleted = await this.petDAO.deleteById(id);
    return mapEntity(deleted);
  }
}

import { mapEntity } from './mapper.js';

export class AdoptionRepository {
  constructor(adoptionDAO) {
    this.adoptionDAO = adoptionDAO;
  }

  async create(adoptionData) {
    const adoption = await this.adoptionDAO.create(adoptionData);
    return mapEntity(adoption);
  }

  async createMany(adoptionDataList) {
    const adoptions = await this.adoptionDAO.createMany(adoptionDataList);
    return adoptions.map(mapEntity);
  }

  async getById(id) {
    const adoption = await this.adoptionDAO.findById(id);
    return mapEntity(adoption);
  }

  async getAll(filters = {}) {
    const adoptions = await this.adoptionDAO.findAll(filters);
    return adoptions.map(mapEntity);
  }
}

import { AdoptionModel } from './models/adoption.model.js';
import { toMongoFilters } from '../../utils/filters.js';

export class AdoptionMongoDAO {
  async create(adoptionData) {
    const doc = await AdoptionModel.create(adoptionData);
    return doc.toObject();
  }

  async createMany(adoptionDataList) {
    const docs = await AdoptionModel.insertMany(adoptionDataList);
    return docs.map((doc) => doc.toObject());
  }

  async findById(id) {
    return AdoptionModel.findById(id).lean();
  }

  async findAll(filters = {}) {
    return AdoptionModel.find(toMongoFilters(filters)).lean();
  }
}

import { PetModel } from './models/pet.model.js';
import { toMongoFilters } from '../../utils/filters.js';

export class PetMongoDAO {
  async create(petData) {
    const doc = await PetModel.create(petData);
    return doc.toObject();
  }

  async createMany(petDataList) {
    const docs = await PetModel.insertMany(petDataList);
    return docs.map((doc) => doc.toObject());
  }

  async findById(id) {
    return PetModel.findById(id).lean();
  }

  async findOne(filters) {
    return PetModel.findOne(toMongoFilters(filters)).lean();
  }

  async findAll(filters = {}, { page, limit } = {}) {
    const query = toMongoFilters(filters);
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        PetModel.find(query).skip(skip).limit(limit).lean(),
        PetModel.countDocuments(query)
      ]);
      return { data, total };
    }
    return PetModel.find(query).lean();
  }

  async updateById(id, updateData) {
    return PetModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async deleteById(id) {
    return PetModel.findByIdAndDelete(id).lean();
  }
}

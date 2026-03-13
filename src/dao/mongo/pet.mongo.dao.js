import { PetModel } from './models/pet.model.js';

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
    return PetModel.findOne(filters).lean();
  }

  async findAll(filters = {}, { page, limit } = {}) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        PetModel.find(filters).skip(skip).limit(limit).lean(),
        PetModel.countDocuments(filters)
      ]);
      return { data, total };
    }
    return PetModel.find(filters).lean();
  }

  async updateById(id, updateData) {
    return PetModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async deleteById(id) {
    return PetModel.findByIdAndDelete(id).lean();
  }
}

import { UserModel } from './models/user.model.js';

export class UserMongoDAO {
  async create(userData) {
    const doc = await UserModel.create(userData);
    return doc.toObject();
  }

  async createMany(userDataList) {
    const docs = await UserModel.insertMany(userDataList);
    return docs.map((doc) => doc.toObject());
  }

  async findById(id) {
    return UserModel.findById(id).lean();
  }

  async findOne(filters) {
    return UserModel.findOne(filters).lean();
  }

  async findAll(filters = {}, { page, limit } = {}) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        UserModel.find(filters).skip(skip).limit(limit).lean(),
        UserModel.countDocuments(filters)
      ]);
      return { data, total };
    }
    return UserModel.find(filters).lean();
  }

  async updateById(id, updateData) {
    return UserModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).lean();
  }

  async pushPet(userId, petId) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { pets: petId } },
      { returnDocument: 'after' }
    ).lean();
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }
}

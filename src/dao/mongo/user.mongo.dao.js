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

  async findAll(filters = {}) {
    return UserModel.find(filters).lean();
  }

  async updateById(id, updateData) {
    return UserModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  async pushPet(userId, petId) {
    return UserModel.findByIdAndUpdate(userId, { $addToSet: { pets: petId } }, { new: true }).lean();
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }
}

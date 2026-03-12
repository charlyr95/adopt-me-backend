import { mapEntity } from './mapper.js';

export class UserRepository {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async create(userData) {
    const user = await this.userDAO.create(userData);
    return mapEntity(user);
  }

  async createMany(userDataList) {
    const users = await this.userDAO.createMany(userDataList);
    return users.map(mapEntity);
  }

  async getById(id) {
    const user = await this.userDAO.findById(id);
    return mapEntity(user);
  }

  async getByEmail(email) {
    const user = await this.userDAO.findOne({ email });
    return mapEntity(user);
  }

  async getAll(filters = {}) {
    const users = await this.userDAO.findAll(filters);
    return users.map(mapEntity);
  }

  async updateById(id, updateData) {
    const updated = await this.userDAO.updateById(id, updateData);
    return mapEntity(updated);
  }

  async addPetToUser(userId, petId) {
    const updated = await this.userDAO.pushPet(userId, petId);
    return mapEntity(updated);
  }

  async deleteById(id) {
    const deleted = await this.userDAO.deleteById(id);
    return mapEntity(deleted);
  }
}

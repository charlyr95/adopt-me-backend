import crypto from 'crypto';
import { BaseFileDAO } from './base.file.dao.js';
import { caseInsensitiveMatch } from '../../utils/filters.js';

export class UserFileDAO extends BaseFileDAO {
  constructor() {
    super('users.json');
  }

  async create(userData) {
    const users = await this._readAll();
    const user = { id: crypto.randomUUID(), pets: [], ...userData };
    users.push(user);
    await this._writeAll(users);
    return user;
  }

  async createMany(userDataList) {
    const users = await this._readAll();
    const created = userDataList.map((userData) => ({
      id: crypto.randomUUID(),
      pets: [],
      ...userData
    }));
    users.push(...created);
    await this._writeAll(users);
    return created;
  }

  async findById(id) {
    const users = await this._readAll();
    return users.find((user) => user.id === id) || null;
  }

  async findOne(filters) {
    const users = await this._readAll();
    return (
      users.find((user) =>
        Object.entries(filters).every(([key, value]) => caseInsensitiveMatch(user[key], value))
      ) || null
    );
  }

  async findAll(filters = {}, { page, limit } = {}) {
    const users = await this._readAll();
    const results = users.filter((user) =>
      Object.entries(filters).every(([key, value]) => caseInsensitiveMatch(user[key], value))
    );
    if (page && limit) {
      const total = results.length;
      const skip = (page - 1) * limit;
      return { data: results.slice(skip, skip + limit), total };
    }
    return results;
  }

  async updateById(id, updateData) {
    const users = await this._readAll();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) return null;

    users[index] = { ...users[index], ...updateData };
    await this._writeAll(users);
    return users[index];
  }

  async pushPet(userId, petId) {
    const users = await this._readAll();
    const index = users.findIndex((user) => user.id === userId);

    if (index === -1) return null;

    const pets = Array.isArray(users[index].pets) ? users[index].pets : [];
    if (!pets.includes(petId)) pets.push(petId);
    users[index].pets = pets;

    await this._writeAll(users);
    return users[index];
  }

  async deleteById(id) {
    const users = await this._readAll();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) return null;

    const [deleted] = users.splice(index, 1);
    await this._writeAll(users);
    return deleted;
  }
}

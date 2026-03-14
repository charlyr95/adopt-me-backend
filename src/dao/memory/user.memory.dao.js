import crypto from 'crypto';
import { memoryStore } from './store.js';
import { caseInsensitiveMatch } from '../../utils/filters.js';

export class UserMemoryDAO {
  async create(userData) {
    const user = { id: crypto.randomUUID(), pets: [], ...userData };
    memoryStore.users.push(user);
    return user;
  }

  async createMany(userDataList) {
    const users = userDataList.map((userData) => ({
      id: crypto.randomUUID(),
      pets: [],
      ...userData
    }));
    memoryStore.users.push(...users);
    return users;
  }

  async findById(id) {
    return memoryStore.users.find((user) => user.id === id) || null;
  }

  async findOne(filters) {
    return (
      memoryStore.users.find((user) =>
        Object.entries(filters).every(([key, value]) => caseInsensitiveMatch(user[key], value))
      ) || null
    );
  }

  async findAll(filters = {}, { page, limit } = {}) {
    const results = memoryStore.users.filter((user) =>
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
    const index = memoryStore.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    memoryStore.users[index] = { ...memoryStore.users[index], ...updateData };
    return memoryStore.users[index];
  }

  async pushPet(userId, petId) {
    const index = memoryStore.users.findIndex((user) => user.id === userId);
    if (index === -1) return null;

    const pets = Array.isArray(memoryStore.users[index].pets) ? memoryStore.users[index].pets : [];
    if (!pets.includes(petId)) pets.push(petId);
    memoryStore.users[index].pets = pets;

    return memoryStore.users[index];
  }

  async deleteById(id) {
    const index = memoryStore.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    const [deleted] = memoryStore.users.splice(index, 1);
    return deleted;
  }
}

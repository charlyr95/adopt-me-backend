import crypto from 'crypto';
import { BaseFileDAO } from './base.file.dao.js';
import { caseInsensitiveMatch } from '../../utils/filters.js';

export class AdoptionFileDAO extends BaseFileDAO {
  constructor() {
    super('adoptions.json');
  }

  async create(adoptionData) {
    const adoptions = await this._readAll();
    const adoption = {
      id: crypto.randomUUID(),
      adoptionDate: new Date().toISOString(),
      ...adoptionData
    };
    adoptions.push(adoption);
    await this._writeAll(adoptions);
    return adoption;
  }

  async createMany(adoptionDataList) {
    const adoptions = await this._readAll();
    const created = adoptionDataList.map((adoptionData) => ({
      id: crypto.randomUUID(),
      adoptionDate: new Date().toISOString(),
      ...adoptionData
    }));
    adoptions.push(...created);
    await this._writeAll(adoptions);
    return created;
  }

  async findById(id) {
    const adoptions = await this._readAll();
    return adoptions.find((adoption) => adoption.id === id) || null;
  }

  async findAll(filters = {}) {
    const adoptions = await this._readAll();
    return adoptions.filter((adoption) =>
      Object.entries(filters).every(([key, value]) => caseInsensitiveMatch(adoption[key], value))
    );
  }
}

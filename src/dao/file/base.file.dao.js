import fs from 'fs/promises';
import path from 'path';

export class BaseFileDAO {
  constructor(filename) {
    this.filePath = path.resolve(process.cwd(), 'data', filename);
  }

  async _ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, '[]', 'utf-8');
    }
  }

  async _readAll() {
    await this._ensureFile();
    const content = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(content || '[]');
  }

  async _writeAll(data) {
    await this._ensureFile();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

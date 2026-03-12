export class TimestampsEntity {
  constructor(entity) {
    this.createdAt = entity.createdAt || null;
    this.updatedAt = entity.updatedAt || null;
  }
}

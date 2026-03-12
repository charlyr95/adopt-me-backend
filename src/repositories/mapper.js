export const mapEntity = (entity) => {
  if (!entity) return null;

  const normalized = { ...entity };

  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id.toString();
  }

  delete normalized._id;
  delete normalized.__v;

  return normalized;
};

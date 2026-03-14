import { TimestampsEntity } from "./common.dto.js";

export const PetResponseListDTO = (petsArray) => {
  return petsArray.map((pet) => new PetResponseDTO(pet));
};

export class PetDTO extends TimestampsEntity {
  constructor(pet) {
    super(pet);
    this.id = pet.id || pet._id || null;
    this.status = pet.status ?? null;
    this.owner = pet.owner ?? null;
    this.name = pet.name ?? null;
    this.age = pet.age ?? null;
    this.species = pet.species ?? null;
    this.breed = pet.breed ?? null;
    this.description = pet.description ?? null;
    this.photos = pet.photos || [];
  }
}

// For responses, we can include additional fields or transformations if needed
export class PetResponseDTO extends PetDTO {
  constructor(pet) {
    super(pet);
  }
}

export class PetCreateDTO {
  constructor(pet) {
    this.name = pet.name ?? "Unnamed";
    this.age = pet.age ?? 0;
    this.species = pet.species ?? "Unknown";
    this.breed = pet.breed ?? "Unknown";
    this.description = pet.description ?? "No description";
    this.photos = pet.photos || [];
  }
}

export class PetUpdateDTO {
  constructor(pet) {
    if (pet.name !== undefined) this.name = pet.name;
    if (pet.age !== undefined) this.age = pet.age;
    if (pet.species !== undefined) this.species = pet.species;
    if (pet.breed !== undefined) this.breed = pet.breed;
    if (pet.description !== undefined) this.description = pet.description;
    if (pet.photos !== undefined) this.photos = pet.photos;
    if (pet.status !== undefined) this.status = pet.status;
    if (pet.owner !== undefined) this.owner = pet.owner;
  }
}

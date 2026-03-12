import { faker } from "@faker-js/faker";

class MockPet {
  constructor() {
    this.name = faker.animal.petName();
    this.age = Math.floor(Math.random() * 16) + 1;
    this.species = this.#getRandomSpecies();
    this.breed = this.#getBreedBySpecies(this.species);
    this.description = faker.lorem.sentence();
    this.photos = [faker.image.urlPicsumPhotos()];
  }

  get() {
    return {
      name: this.name,
      age: this.age,
      species: this.species,
      breed: this.breed,
      description: this.description,
      photos: this.photos,
    };
  }

  #getRandomSpecies() {
    const speciesOptions = ["Dog", "Cat", "Rabbit", "Hamster", "Bird"];
    const species = speciesOptions[Math.floor(Math.random() * speciesOptions.length)];
    return species;
  }

  #getBreedBySpecies = (species) => {
    species = species.toLowerCase();
    if (species === "dog") return faker.animal.dog();
    if (species === "cat") return faker.animal.cat();
    if (species === "rabbit") return faker.animal.rabbit();
    if (species === "bird") return faker.animal.bird();
    if (species === "hamster") return "Hamster Breed";
    return "Unknown";
  };
}

export const generatePets = (count = 10) => {
  const pets = [];
  if (count > 1000) count = 1000; // Limit the maximum number of pets to 1000
  for (let i = 0; i < count; i++) {
    const pet = new MockPet();
    pets.push(pet.get());
  }
  return pets;
};


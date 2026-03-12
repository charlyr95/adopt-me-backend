import { createDAOs } from '../dao/factory.js';
import { UserRepository } from './user.repository.js';
import { PetRepository } from './pet.repository.js';
import { AdoptionRepository } from './adoption.repository.js';

const { userDAO, petDAO, adoptionDAO } = createDAOs();

export const userRepository = new UserRepository(userDAO);
export const petRepository = new PetRepository(petDAO);
export const adoptionRepository = new AdoptionRepository(adoptionDAO);

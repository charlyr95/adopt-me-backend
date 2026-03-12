import { env } from '../config/env.config.js';
import { UserMongoDAO } from './mongo/user.mongo.dao.js';
import { PetMongoDAO } from './mongo/pet.mongo.dao.js';
import { AdoptionMongoDAO } from './mongo/adoption.mongo.dao.js';
import { UserFileDAO } from './file/user.file.dao.js';
import { PetFileDAO } from './file/pet.file.dao.js';
import { AdoptionFileDAO } from './file/adoption.file.dao.js';
import { UserMemoryDAO } from './memory/user.memory.dao.js';
import { PetMemoryDAO } from './memory/pet.memory.dao.js';
import { AdoptionMemoryDAO } from './memory/adoption.memory.dao.js';

export const createDAOs = () => {
  if (env.PERSISTENCE === 'mongo') {
    return {
      userDAO: new UserMongoDAO(),
      petDAO: new PetMongoDAO(),
      adoptionDAO: new AdoptionMongoDAO()
    };
  }

  if (env.PERSISTENCE === 'file') {
    return {
      userDAO: new UserFileDAO(),
      petDAO: new PetFileDAO(),
      adoptionDAO: new AdoptionFileDAO()
    };
  }

  return {
    userDAO: new UserMemoryDAO(),
    petDAO: new PetMemoryDAO(),
    adoptionDAO: new AdoptionMemoryDAO()
  };
};

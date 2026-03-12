import { petService } from '../services/pet.service.js';
import { successResponse } from '../dto/response.dto.js';
import { env } from '../config/env.config.js';
import { removeUploadedFiles } from '../middlewares/upload.middleware.js';

const buildPhotoUrls = (files = []) => {
  const baseUrl = env.APP_BASE_URL.replace(/\/$/, '');
  return files.map((file) => `${baseUrl}/uploads/${file.filename}`);
};

export const createPet = async (req, res, next) => {
  try {
    const uploadedPhotos = buildPhotoUrls(req.files || []);
    const payload = { ...req.body };
    if (uploadedPhotos.length > 0) payload.photos = uploadedPhotos;

    const pet = await petService.create(payload);
    res.status(201).json(successResponse('Pet created successfully', pet));
  } catch (error) {
    await removeUploadedFiles(req.files || []);
    next(error);
  }
};

export const getPets = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.species) filters.species = req.query.species;

    const pets = await petService.getAll(filters);
    res.json(successResponse('Pets fetched successfully', pets));
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const pet = await petService.getById(req.params.id);
    res.json(successResponse('Pet fetched successfully', pet));
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const uploadedPhotos = buildPhotoUrls(req.files || []);
    const payload = { ...req.body };
    if (uploadedPhotos.length > 0) payload.photos = uploadedPhotos;

    const pet = await petService.updateById(req.params.id, payload);
    res.json(successResponse('Pet updated successfully', pet));
  } catch (error) {
    await removeUploadedFiles(req.files || []);
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const deleted = await petService.deleteById(req.params.id);
    res.json(successResponse('Pet deleted successfully', deleted));
  } catch (error) {
    next(error);
  }
};

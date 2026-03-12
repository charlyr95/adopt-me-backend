import { adoptionService } from '../services/adoption.service.js';
import { successResponse } from '../dto/response.dto.js';

export const createAdoption = async (req, res, next) => {
  try {
    const ownerId = req.user?.id || req.user?._id;
    if (!ownerId) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }
    const result = await adoptionService.createAdoption(ownerId, req.body.petId);
    res.status(201).json(successResponse('Adoption created successfully', result));
  } catch (error) {
    next(error);
  }
};

export const getAdoptions = async (req, res, next) => {
  try {
    const adoptions = await adoptionService.getAll();
    res.json(successResponse('Adoptions fetched successfully', adoptions));
  } catch (error) {
    next(error);
  }
};

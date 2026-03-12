import { validationResult } from 'express-validator';
import { errorResponse } from '../dto/response.dto.js';
import { removeUploadedFiles } from './upload.middleware.js';

export const validate = (validations) => [
  ...validations,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      await removeUploadedFiles(req.files || []);
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    return next();
  }
];

import { userService } from '../services/user.service.js';
import { successResponse } from '../dto/response.dto.js';

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(successResponse('User created successfully', user));
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    const users = await userService.getAll(filters);
    res.json(successResponse('Users fetched successfully', users));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    res.json(successResponse('User fetched successfully', user));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateById(req.params.id, req.body);
    res.json(successResponse('User updated successfully', user));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteById(req.params.id);
    res.json(successResponse('User deleted successfully', result));
  } catch (error) {
    next(error);
  }
};

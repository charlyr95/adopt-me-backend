import { Router } from "express";
import { generatePets } from "../mock/pet.mock.js";
import { generateUsers } from "../mock/user.mock.js";
import { successResponse } from "../dto/response.dto.js";
import { userService } from "../services/user.service.js";
import { petService } from "../services/pet.service.js";
import { authorizeRoles, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// ------------- Users ------------
router.get("/users", (req, res) => {
  const users = generateUsers();
  res.json(successResponse(users));
});

router.get("/users/:count", (req, res) => {
  const count = parseInt(req.params.count, 10);
  const users = generateUsers(count);
  res.json(successResponse(users));
});

router.post("/users", requireAuth, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const users = generateUsers();
    const createdUsers = await userService.createMany(users);
    res.json(successResponse(createdUsers));
  } catch (error) {
    next(error);
  }
});

router.post("/users/:count", requireAuth, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const count = parseInt(req.params.count, 10);
    const users = generateUsers(count);
    const createdUsers = await userService.createMany(users);
    res.json(successResponse(createdUsers));
  } catch (error) {
    next(error);
  }
});

// ------------- Pets -------------
router.get("/pets", (req, res) => {
  const pets = generatePets();
  res.json(successResponse(pets));
});

router.get("/pets/:count", (req, res) => {
  const count = parseInt(req.params.count, 10);
  const pets = generatePets(count);
  res.json(successResponse(pets));
});

router.post("/pets", requireAuth, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const pets = generatePets();
    const createdPets = await petService.createMany(pets);
    res.json(successResponse(createdPets));
  } catch (error) {
    next(error);
  }
});

router.post("/pets/:count", requireAuth, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const count = parseInt(req.params.count, 10);
    const pets = generatePets(count);
    const createdPets = await petService.createMany(pets);
    res.json(successResponse(createdPets));
  } catch (error) {
    next(error);
  }
});

export default router;

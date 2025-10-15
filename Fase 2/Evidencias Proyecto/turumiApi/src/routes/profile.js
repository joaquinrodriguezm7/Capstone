import { Router } from "express";
import auth from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { getProfile, createProfile, updateProfile } from "../controllers/profileController.js";

const router = Router();

router.get('/', auth, getProfile);

router.post('/', auth, createProfile);

router.put('/', auth, updateProfile);

export default router;
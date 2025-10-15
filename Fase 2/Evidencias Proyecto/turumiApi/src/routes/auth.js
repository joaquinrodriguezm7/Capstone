import { Login } from '../controllers/loginController'
import { Router } from "express";
import { loginValidators } from "../validators/loginValidator";
import { refreshToken } from '../controllers/refreshTokenController';
import validate from "../middleware/validate";
import { logout } from '../controllers/logoutController.js';

const router = Router();

router.post('/login', loginValidators, validate, Login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
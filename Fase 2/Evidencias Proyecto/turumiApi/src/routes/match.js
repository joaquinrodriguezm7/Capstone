import { Router } from "express";
import { createMatch, getMatch, updateMatch } from "../controllers/matchController.js";
import auth from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", auth, createMatch);
router.get("/", auth, getMatch);
router.put("/", auth, updateMatch);

export default router;
import { Router } from "express";
import { db } from "../db.js";
import auth from "../middleware/authMiddleware.js";
import { uploadPhoto, getPhoto, deletePhoto } from "../controllers/userPhotoController";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getPhoto);
router.post('/upload', auth, upload.array("images", 6), uploadPhoto);
router.delete('/:photoId', auth, deletePhoto);

export default router;
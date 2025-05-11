import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/image', upload.single('image'), uploadImage);

export default router;
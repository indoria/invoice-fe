import { validationResult } from 'express-validator';

export const uploadImage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    // In a production environment, you would typically:
    // 1. Upload the file to a cloud storage service (e.g., AWS S3)
    // 2. Get the URL of the uploaded file
    // 3. Return that URL to the client
    // For now, we'll just return the local path
    const filePath = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      filePath
    });
  } catch (error) {
    next(error);
  }
};
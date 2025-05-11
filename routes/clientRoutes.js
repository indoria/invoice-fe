import express from 'express';
import {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    searchClients
} from '../controllers/clientController.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateClient = [
    body('businessName').notEmpty().trim().escape(),
    body('businessEmail').isEmail().normalizeEmail(),
    body('businessPhone').optional().trim(),
    body('fax').optional().trim(),
    body('streetAddress').optional().trim(),
    body('city').optional().trim(),
    body('state').optional().trim(),
    body('zipCode').optional().trim(),
    body('businessNumber').optional().trim()
];

router.route('/')
    .get(getClients)
    .post(validateClient, createClient);

router.get('/search', searchClients);

router.route('/:id')
    .get(getClientById)
    .put(validateClient, updateClient)
    .delete(deleteClient);

export default router;
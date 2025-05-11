import express from 'express';
import {
    getInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    searchInventoryItems
} from '../controllers/inventoryController.js';
import { body } from 'express-validator';

const router = express.Router();

const validateInventoryItem = [
    body('itemName').notEmpty().trim().escape(),
    body('itemDescription').optional().trim().escape(),
    body('itemSku').notEmpty().trim().escape(),
    body('cost').isNumeric().toFloat(),
    body('price').isNumeric().toFloat()
];

router.route('/')
    .get(getInventoryItems)
    .post(validateInventoryItem, createInventoryItem);

router.get('/search', searchInventoryItems);

router.route('/:id')
    .get(getInventoryItemById)
    .put(validateInventoryItem, updateInventoryItem)
    .delete(deleteInventoryItem);

export default router;
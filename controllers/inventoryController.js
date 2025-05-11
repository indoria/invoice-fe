import Inventory from '../models/inventory.js';
import { validationResult } from 'express-validator';

// Get all inventory items
export const getInventoryItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt';
    
    const items = await Inventory.find({ deleted: false })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Inventory.countDocuments({ deleted: false });
    
    res.json({
      items,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    next(error);
  }
};

// Get inventory item by ID
export const getInventoryItemById = async (req, res, next) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.id, deleted: false });
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Create new inventory item
export const createInventoryItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    const item = new Inventory(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error('Item with this name or SKU already exists'));
    } else {
      next(error);
    }
  }
};

// Update inventory item
export const updateInventoryItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    res.json(item);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error('Item with this name or SKU already exists'));
    } else {
      next(error);
    }
  }
};

// Soft delete inventory item
export const deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Search inventory items
export const searchInventoryItems = async (req, res, next) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchQuery = {
      deleted: false,
      $or: [
        { itemName: { $regex: query, $options: 'i' } },
        { itemDescription: { $regex: query, $options: 'i' } },
        { itemSku: { $regex: query, $options: 'i' } }
      ]
    };

    const items = await Inventory.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Inventory.countDocuments(searchQuery);

    res.json({
      items,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    next(error);
  }
};
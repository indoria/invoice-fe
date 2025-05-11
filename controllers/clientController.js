import Client from '../models/client.js';
import { validationResult } from 'express-validator';

// Get all clients
export const getClients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt';
    
    const clients = await Client.find({ deleted: false })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Client.countDocuments({ deleted: false });
    
    res.json({
      clients,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalClients: total
    });
  } catch (error) {
    next(error);
  }
};

// Get client by ID
export const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, deleted: false });
    if (!client) {
      res.status(404);
      throw new Error('Client not found');
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

// Create new client
export const createClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    const client = new Client(req.body);
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error('Client with this business name or email already exists'));
    } else {
      next(error);
    }
  }
};

// Update client
export const updateClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      res.status(404);
      throw new Error('Client not found');
    }

    res.json(client);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error('Client with this business name or email already exists'));
    } else {
      next(error);
    }
  }
};

// Soft delete client
export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!client) {
      res.status(404);
      throw new Error('Client not found');
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Search clients
export const searchClients = async (req, res, next) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchQuery = {
      deleted: false,
      $or: [
        { businessName: { $regex: query, $options: 'i' } },
        { businessEmail: { $regex: query, $options: 'i' } },
        { businessPhone: { $regex: query, $options: 'i' } }
      ]
    };

    const clients = await Client.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Client.countDocuments(searchQuery);

    res.json({
      clients,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalClients: total
    });
  } catch (error) {
    next(error);
  }
};
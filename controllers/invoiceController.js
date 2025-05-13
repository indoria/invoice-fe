import Invoice from '../models/invoice.js';
import Inventory from '../models/inventory.js';
import Client from '../models/client.js';
import { validationResult } from 'express-validator';

export const getInvoices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt';
    const status = req.query.status;
    
    const query = { deleted: false };
    if (status) query.status = status;
    
    const invoices = await Invoice.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Invoice.countDocuments(query);
    
    res.json({
      invoices,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInvoices: total
    });
  } catch (error) {
    next(error);
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, deleted: false });
    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

// Create new invoice
export const createInvoice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    // Process payee info
    const payeeInfo = req.body.payeeInfo;
    if (payeeInfo) {
      const existingClient = await Client.findOne({
        businessName: payeeInfo.businessName,
        deleted: false
      });

      if (!existingClient) {
        const newClient = new Client(payeeInfo);
        await newClient.save();
      } else {
        await Client.updateOne({ _id: existingClient._id }, payeeInfo);
      }
    }

    // Process items and update inventory
    if (req.body.items && req.body.items.length > 0) {
      for (const item of req.body.items) {
        const existingItem = await Inventory.findOne({
          itemName: item.itemName,
          deleted: false
        });

        if (!existingItem) {
          const newItem = new Inventory({
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            itemSku: item.itemSku,
            cost: item.cost,
            price: item.price
          });
          const savedItem = await newItem.save();
          item.inventoryItemId = savedItem._id;
        } else {
          item.inventoryItemId = existingItem._id;
          await Inventory.updateOne(
            { _id: existingItem._id },
            {
              cost: item.cost,
              price: item.price,
              itemDescription: item.itemDescription
            }
          );
        }
      }
    }

    const invoice = new Invoice(req.body);
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error('Invoice with this number already exists'));
    } else {
      next(error);
    }
  }
};

// Update invoice
export const updateInvoice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    // Process payee info and items similar to create
    if (req.body.payeeInfo) {
      const existingClient = await Client.findOne({
        businessName: req.body.payeeInfo.businessName,
        deleted: false
      });

      if (!existingClient) {
        const newClient = new Client(req.body.payeeInfo);
        await newClient.save();
      } else {
        await Client.updateOne({ _id: existingClient._id }, req.body.payeeInfo);
      }
    }

    if (req.body.items && req.body.items.length > 0) {
      for (const item of req.body.items) {
        const existingItem = await Inventory.findOne({
          itemName: item.itemName,
          deleted: false
        });

        if (!existingItem) {
          const newItem = new Inventory({
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            itemSku: item.itemSku,
            cost: item.cost,
            price: item.price
          });
          const savedItem = await newItem.save();
          item.inventoryItemId = savedItem._id;
        } else {
          item.inventoryItemId = existingItem._id;
          await Inventory.updateOne(
            { _id: existingItem._id },
            {
              cost: item.cost,
              price: item.price,
              itemDescription: item.itemDescription
            }
          );
        }
      }
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

// Soft delete invoice
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Search invoices
export const searchInvoices = async (req, res, next) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchQuery = {
      deleted: false,
      $or: [
        { invoiceNumber: { $regex: query, $options: 'i' } },
        { 'payeeInfo.businessName': { $regex: query, $options: 'i' } },
        { 'payeeInfo.businessEmail': { $regex: query, $options: 'i' } }
      ]
    };

    const invoices = await Invoice.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Invoice.countDocuments(searchQuery);

    res.json({
      invoices,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInvoices: total
    });
  } catch (error) {
    next(error);
  }
};

// Get invoice total
export const getInvoiceTotal = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, deleted: false });
    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }

    const total = invoice.items.reduce((sum, item) => {
      return sum + (item.price * item.numberOfUnits);
    }, 0);

    res.json({ total });
  } catch (error) {
    next(error);
  }
};

// Update invoice status
export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { status: 'sent' },
      { new: true }
    );

    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
};
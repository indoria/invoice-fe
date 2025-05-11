import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  searchInvoices,
  getInvoiceTotal,
  updateInvoiceStatus
} from '../controllers/invoiceController.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateInvoice = [
  body('invoiceNumber').notEmpty().trim(),
  body('invoiceDate').isISO8601().toDate(),
  body('dueDate').notEmpty(),
  body('billerInfo').isObject(),
  body('billerInfo.businessName').notEmpty().trim(),
  body('billerInfo.businessEmail').isEmail().normalizeEmail(),
  body('payeeInfo').isObject(),
  body('payeeInfo.businessName').notEmpty().trim(),
  body('payeeInfo.businessEmail').isEmail().normalizeEmail(),
  body('items').isArray(),
  body('items.*.itemId').notEmpty(),
  body('items.*.itemName').notEmpty().trim(),
  body('items.*.cost').isNumeric().toFloat(),
  body('items.*.price').isNumeric().toFloat(),
  body('items.*.numberOfUnits').isInt({ min: 1 }).toInt()
];

router.route('/')
  .get(getInvoices)
  .post(validateInvoice, createInvoice);

router.get('/search', searchInvoices);
router.get('/drafts', (req, res) => {
  req.query.status = 'draft';
  getInvoices(req, res);
});

router.route('/:id')
  .get(getInvoiceById)
  .put(validateInvoice, updateInvoice)
  .delete(deleteInvoice);

router.get('/:id/total', getInvoiceTotal);
router.post('/:id/send', updateInvoiceStatus);

export default router;
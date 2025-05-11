import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  billerInfo: {
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    businessPhone: String,
    fax: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    businessNumber: String,
    companyLogoUrl: String,
    signatureImageUrl: String,
  },
  payeeInfo: {
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    businessPhone: String,
    fax: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    businessNumber: String,
  },
  items: [{
    itemId: { type: String, required: true },
    inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    itemName: { type: String, required: true },
    itemDescription: String,
    itemSku: String,
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    numberOfUnits: { type: Number, required: true },
  }],
  invoiceNotes: String,
  additionalImageUrls: [String],
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'cancelled'],
    default: 'draft',
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Add text index for search functionality
invoiceSchema.index({
  'invoiceNumber': 'text',
  'payeeInfo.businessName': 'text',
  'payeeInfo.businessEmail': 'text',
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
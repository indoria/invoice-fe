import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  itemDescription: String,
  itemSku: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Add text index for search functionality
inventorySchema.index({
  'itemName': 'text',
  'itemDescription': 'text',
  'itemSku': 'text',
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
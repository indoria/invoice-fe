import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  businessEmail: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  businessPhone: String,
  fax: String,
  streetAddress: String,
  city: String,
  state: String,
  zipCode: String,
  businessNumber: String,
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Add text index for search functionality
clientSchema.index({
  'businessName': 'text',
  'businessEmail': 'text',
  'businessPhone': 'text',
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
import mongoose from 'mongoose';

const tenderRequestSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  projectType: {
    type: String,
    required: true,
    trim: true
  },
  projectLocation: {
    type: String,
    required: true,
    trim: true
  },
  estimatedBudget: {
    type: String,
    required: true
  },
  preferredTimeline: {
    type: String,
    required: true
  },
  projectDescription: {
    type: String,
    required: true
  },
    // ✅ Add this part to enable notes
    notes: [
      {
        content: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  
    // (optional) status field if you also want to track it here
    status: {
      type: String,
      enum: ['new', 'reviewed', 'contacted', 'completed', 'rejected'],
      default: 'new'
    }
});

const TenderRequest = mongoose.model('TenderRequest', tenderRequestSchema);

export default TenderRequest;
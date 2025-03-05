const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  name: String,
  dose: {
    amount: Number,
    unit: {
      type: String,
      enum: ['g', 'mg', 'ml']
    }
  },
  category: {
    type: String,
    enum: ['action', 'problem', 'treatment', 'scheme', 'insemination', 'examination']
  },
  inseminationType: {
    type: String,
    enum: ['natural', 'artificial']
  },
  inseminationResult: Boolean,
  bull: {
    type: mongoose.Schema.ObjectId,
    ref: 'Animal'
  },
  result: String,
  note: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  farm: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farm'
  },
  disease: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vet'
  },
  cured: Boolean,
  animal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Animal'
  },
  /* For multiple animals actions */
  subId: String,
  scheme: {
    type: mongoose.Schema.ObjectId,
    ref: 'Scheme'
  },
  firstSchemeAction: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vet'
  },
  schemeStarter: {
    type: Boolean,
    default: false
  },
  schemeInsemination: {
    type: Boolean,
    default: false
  },
  schemeResult: {
    type: String,
    enum: ['true', 'false', 'undefined'],
    default: 'undefined'
  },
  medication: {
    type: mongoose.Schema.ObjectId,
    ref: 'Inventory'
  },
  quantity: Number,
  scheduled: {
    type: Boolean,
    default: false
  },
  creationDate: {
    type: Date,
    default: Date.now()
  },
  editedAtBy: [
    {
      date: Date,
      message: String,
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    }
  ],
  finished: Boolean,
  urgency: {
    type: String,
    enum: ['high', 'mid', 'low'],
    default: 'low'
  },
  priority: {
    type: String,
    enum: ['high', 'mid', 'low'],
    default: 'low'
  },
  planned: {
    type: String,
    enum: ['true', 'false'],
    default: 'false'
  },
  inseminationR: {
    type: String
  },
  vetR: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vet'
  },
  attentionRequired: {
    type: Boolean,
    default: false
  },
  attentionAction: String,
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate
vetSchema.virtual('otherPoints', {
  ref: 'Vet',
  foreignField: 'firstSchemeAction',
  localField: '_id'
});

vetSchema.virtual('treatments', {
  ref: 'Vet',
  foreignField: 'disease',
  localField: '_id'
});

vetSchema.virtual('medications', {
  ref: 'Inventory',
  foreignField: 'medicationRel',
  localField: '_id'
});


const Vet = mongoose.model('Vet', vetSchema);

module.exports = Vet;
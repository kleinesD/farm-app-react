const mongoose = require('mongoose');

const inventoryScheme = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sample', 'record']
  },
  recordType: {
    type: String,
    enum: ['increase', 'decrease']
  },
  medicationType: {
    type: String,
    enum: ['antibacterial', 'anti-inflammatory', 'antiparasitic', 'vaccine', 'hormonal', 'vitamins', 'antidotes', 'analgesics', 'tranquilizers', 'antihistamines']
  },
  medicationRel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vet'
  },
  medication: {
    type: mongoose.Schema.ObjectId,
    ref: 'Inventory'
  }, 
  name: {
    type: String
  },
  note: String,
  cost: Number,
  quantity: {
    type: Number,
    default: 0
  },
  medicationUnit: {
    type: String,
    enum: ['mg', 'ml', 'g']
  },
  creationDate: {
    type: Date,
    default: Date.now()
  },
  date: {
    type: Date,
    default: Date.now()
  },
  expDate: Date,
  depreciationRate: Number,
  currentValue: Number,
  addMoreAlert: Number,
  instruction: String,
  module: {
    type: String,
    enum: ['all', 'herd', 'vet']
  },
  inventoryType: {
    type: String,
    enum: ['equipment', 'food', 'vet', 'medication', 'other']
  },
  farm: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farm'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  animal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Animal'
  },
  subId: String,
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
});

const Inventory = mongoose.model('Inventory', inventoryScheme);
module.exports = Inventory;
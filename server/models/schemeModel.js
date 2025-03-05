const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: String,
  farm: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farm'
  },
  points: [
    {
      action: {
        type: String,
        enum: ['action', 'insemination']
      },
      countFrom: {
        type: String,
        enum: ['last-point', 'start']
      },
      scheduledIn: Number,
      timeUnit: {
        type: String,
        enum: ['h', 'd']
      },
      firstPoint: {
        type: Boolean,
        default: false
      },
      insemination: {
        type: Boolean,
        default: false
      },
      medication: {
        type: mongoose.Schema.ObjectId,
        ref: 'Inventory'
      },
      quantity: Number
    }
  ],
  included: {
    type: Boolean,
    default: false
  },
  creationDate: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
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
});

const Scheme = mongoose.model('Scheme', schemeSchema);
module.exports = Scheme;
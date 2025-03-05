const mongoose = require('mongoose');

const accRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  category: {
    type: 'String'
  },
  date: Date,
  amount: Number,
  animal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Animal'
  },
  vet: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vet'
  },
  dist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  feed: {
    type: mongoose.Schema.ObjectId,
    ref: 'Feed'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  farm: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farm'
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
});

const AccRecord = mongoose.model('AccRecord', accRecordSchema);
module.exports = AccRecord;
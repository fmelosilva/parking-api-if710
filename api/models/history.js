const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
  parkingRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parking',
    required: true
  },
  spent: {
    type: Number,
    required: true
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('History', historySchema);
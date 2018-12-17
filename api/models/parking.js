const mongoose = require('mongoose');

const pointSchema = require('../models/point');

const parkingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hourPrice: {
    type: Number,
    required: true
  },
  location: {
    type: pointSchema,
    required: true
  },
  radius: {
    type: Number,
    required: true
  },
  openingTime: {
    type: Date,
    required: true
  },
  closingTime: {
    type: Date,
    required: true
  }
});

parkingSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Parking', parkingSchema);
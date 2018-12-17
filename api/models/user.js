const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique : true, 
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  history: [{ type: mongoose.Schema.ObjectId, ref: 'History' }]
});

module.exports = mongoose.model('User', userSchema);
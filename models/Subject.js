const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true,
    immutable: true 
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  units: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Subject', subjectSchema); 
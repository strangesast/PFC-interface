var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Calculation = new Schema({
  name: {
    type: String,
    required: true
  },
  'original-template': String,
  'input-file': {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reading', 'active', 'finished', 'error'],
    default: 'pending',
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  procid: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Calculation', Calculation);

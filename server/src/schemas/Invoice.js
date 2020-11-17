var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const config = require('../config/config');
require('mongoose-long')(mongoose);

var InvoiceSchema = new mongoose.Schema({
  sale: { type: mongoose.Schema.Types.Number, ref: 'Sales' },
  clientInvoice: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDateInvoice: Date,
  emissionDateInvoice: Date,
  paymentDate: Date,
  paymentValue: Number,
  descriptionPayment: String,
  servicesHistory: [
    {
      emissionDateService: Date,
      descriptionServce: String,
      valueService: Number
    }
  ]
});

var connection = mongoose.createConnection(config.mongo);
autoIncrement.initialize(connection);

InvoiceSchema.plugin(autoIncrement.plugin, {
  model: 'Invoice',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Invoice', InvoiceSchema);

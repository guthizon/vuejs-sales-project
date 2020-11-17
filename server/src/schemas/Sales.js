var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
const config = require('../config/config');

var SalesSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  saleDate: Date,
  ciaOper: String,
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ticketNumber: String,
  locale: String,
  destination: String,
  departureDate: Date,
  arrivalDate: Date,
  saleDescription: String,
  currency: {
    type: String,
    'enum': [
      'real',
      'dolar',
      'euro'
    ]
  },
  tariff: Number,
  exchange: Number,
  tariffBrl: Number,
  shippingFee: Number,
  feeRc: Number,
  ravCom: Number,
  inc: Number,
  adCom: Number,
  totalValue: Number,
  totalComission: Number,
  operator: String,
  connections: String,
  paymentMethod: [
    {
      method: {
        type: String,
        'enum': [
          'credito',
          'debito',
          'transferencia',
          'depositoConta',
          'fatura',
          'boleto',
          'dinheiro'
        ]
      },
      account: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceivingAccount' },
      paymentMethodValue: Number,
      paymentInstallments: Number,
      installmentValues: {
        type: [
          {
            type: Number
          }
        ]
      }
    }
  ]
});
var connection = mongoose.createConnection(config.mongo);
autoIncrement.initialize(connection);

SalesSchema.plugin(autoIncrement.plugin, {
  model: 'Sales',
  field: '_id',
  startAt: 100,
  incrementBy: 1
});

module.exports = mongoose.model('Sales', SalesSchema);

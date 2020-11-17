var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

async function hashPassword (user, options) {
  const SALT_FACTOR = 8;

  // if (!user.changed('password')) {
  //   return;
  // }

  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.password = hash;
    });
}

var UserSchema = new mongoose.Schema({
  cpfCnpj: {
    type: mongoose.Types.Long,
    unique: true,
    trim: true,
    required: 'Please fill in a ID'
    // validate: [validateLocalStrategyProperty, 'Please fill in your full name']
  },
  rgInsc: String,
  name: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in a username'
    // validate: [validateLocalStrategyProperty, 'Please fill in your full name']
  },
  nickName: String,
  gender: {
    type: String,
    'enum': [
      'M',
      'F'
    ]
  },
  profile: {
    type: String,
    'enum': [
      'ADMIN',
      'USER'
    ]
  },
  status: {
    type: String,
    'enum': [
      'ACTIVE',
      'INACTIVE'
    ],
    default: 'ACTIVE'
  },
  email: {
    type: String,
    trim: true,
    // default: '',
    required: 'Please fill in a e-mail'
  },
  password: String,
  birthDate: Date,
  phone: String,
  street: String,
  number: String,
  complement: String,
  neighborhood: String,
  city: String,
  cep: String,
  state: String,
  fidelity: {
    type: [
      {
        fidelityCode: String,
        companyName: String
      }
    ]
  },
  bankData: {
    type: [
      {
        bank: String,
        branch: String,
        account: String
      }
    ]
  },
  informations: String
});

UserSchema.pre('save', async function (next) {
  let user = this;
  if (user.password === '') {
    delete user.password;
    return next();
  }
  await hashPassword(this);
});
UserSchema.pre('updateOne', async function (next) {
  let user = this._update;
  if (user.password === '') {
    delete user.password;
    return next();
  }
  await hashPassword(this._update);
  this.updateOne({}, { password: this._update.password });
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compareAsync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

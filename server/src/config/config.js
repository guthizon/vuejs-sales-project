const path = require('path');

module.exports = {
  port: process.env.NODE_ENV === 'production' ? 21123 : 8081,
  db: {
    database: process.env.DB_NAME || 'tabtracker',
    user: process.env.DB_USER || 'tabtracker',
    password: process.env.DB_PASS || 'tabtracker',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: path.resolve(__dirname, '../../academia.sqlite')
    }
  },
  mongo: 'mongodb://localhost/tripzonedb',
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
};

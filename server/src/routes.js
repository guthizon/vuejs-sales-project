const AuthenticationController = require('./controllers/AuthenticationController');
const SalesController = require('./controllers/SalesController');
const UserController = require('./controllers/UserController');
const InvoiceController = require('./controllers/InvoiceController');
const isAuthenticated = require('./policies/isAuthenticated');

module.exports = (app) => {
  app.post('/login',
    AuthenticationController.login);
  app.post('/user',
    isAuthenticated,
    UserController.post);
  app.put('/user',
    isAuthenticated,
    UserController.put);
  app.get('/user',
    isAuthenticated,
    UserController.index);
  app.post('/sales',
    isAuthenticated,
    SalesController.post);
  app.put('/sales',
    isAuthenticated,
    SalesController.put);
  app.get('/sales',
    isAuthenticated,
    SalesController.index);
  app.delete('/sales/:salesId',
    isAuthenticated,
    SalesController.delete);
  app.post('/invoice',
    isAuthenticated,
    InvoiceController.post);
  app.put('/invoice',
    isAuthenticated,
    InvoiceController.put);
  app.get('/invoice',
    isAuthenticated,
    InvoiceController.index);
};

const { Invoice } = require('../schemas');

module.exports = {
  async index (req, res) {
    try {
      const search = req.query.search ? JSON.parse(req.query.search) : undefined;
      let invoice = await Invoice.find(search);
      res.send(invoice);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'an error has occured trying to fetch the users'
      });
    }
  },
  async show (req, res) {
    try {
      const invoice = await Invoice.find(req.params);
      res.send(invoice);
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },
  async post (req, res) {
    try {
      console.log('Criando...', req.body);
      const invoice = await new Invoice(req.body).save();
      res.send(invoice);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: err
      });
    }
  },
  async put (req, res) {
    try {
      await Invoice.updateOne({
        '_id': req.body._id
      }, req.body, {runValidators: true});
      res.send(req.body);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: err
      });
    }
  }
};

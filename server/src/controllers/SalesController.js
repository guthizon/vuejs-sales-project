const {Sales} = require('../schemas');

module.exports = {
  async index (req, res) {
    try {
      const search = req.query.search ? JSON.parse(req.query.search) : undefined;
      let sales = await Sales.find(search);
      res.send(sales);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'an error has occured trying to fetch the users'
      });
    }
  },
  async show (req, res) {
    try {
      const sale = await Sales.find(req.params);
      res.send(sale);
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },
  async post (req, res) {
    try {
      console.log('Criando...', req.body);
      const sale = await new Sales(req.body).save();
      res.send(sale);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: err
      });
    }
  },
  async put (req, res) {
    try {
      await Sales.updateOne({
        '_id': req.body._id
      }, req.body, {runValidators: true});
      res.send(req.body);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: err
      });
    }
  },
  async delete (req, res) {
  }
};

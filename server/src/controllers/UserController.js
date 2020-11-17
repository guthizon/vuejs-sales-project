const { User } = require('../schemas');

module.exports = {
  async index (req, res) {
    try {
      const search = req.query.search ? JSON.parse(req.query.search) : undefined;
      let users = await User.find(search);
      res.send(users);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'an error has occured trying to fetch the users'
      });
    }
  },
  async show (req, res) {
    try {
      const user = await User.find(req.params);
      res.send(user);
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },
  async post (req, res) {
    try {
      console.log('Criando...', req.body);
      const user = await new User(req.body).save();
      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: err
      });
    }
  },
  async put (req, res) {
    try {
      await User.updateOne({
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
  async getNextBirthdays (req, res) {
    try {
      // const users = await User.find({
      //   '$expr': {
      //     '$and': [
      //       { '$eq': [{ '$dayOfMonth': '$birthDate' }, { '$dayOfMonth': new Date() }] },
      //       { '$eq': [{ '$month': '$birthDate' }, { '$month': new Date() }] }
      //     ]
      //   }
      // });

      var today = new Date();
      var m1 = { '$match': { 'birthDate': { '$exists': true, '$ne': '' } } };
      var p1 = {
        '$project': {
          '_id': 1,
          'name': 1,
          'birthDate': 1,
          'todayDayOfYear': { '$dayOfYear': today },
          'dayOfYear': { '$dayOfYear': '$birthDate' }
        }
      };
      var p2 = {
        '$project': {
          '_id': 1,
          'name': 1,
          'birthDate': 1,
          'daysTillBirthday': { '$subtract': [
            { '$add': [
              '$dayOfYear',
              { '$cond': [ { '$lt': [ '$dayOfYear', '$todayDayOfYear' ] }, 365, 0 ] }
            ] },
            '$todayDayOfYear'
          ] }
        }
      };
      let showcase = req.params.showcase || 'upcoming';
      let m2;
      if (showcase === 'today') {
        m2 = { '$match': { 'daysTillBirthday': { '$lte': 1 } } }; // lt:1 = Today Birthdays
      } else if (showcase === 'upcoming') {
        m2 = { '$match': { 'daysTillBirthday': { '$lt': 60 } } }; // lt:60 = Next 60 days Upcoming Birthdays
      } else if (showcase === 'past') {
        m2 = { '$match': { 'daysTillBirthday': { '$gt': 60 } } }; // gt = Past 60 days Birthdays
      }
      const users = await User.aggregate([m1, p1, p2, m2, { '$sort': { 'daysTillBirthday': 1 } }]);
      res.send(users);
    } catch (err) {
      console.log(err);
    }
  }
};

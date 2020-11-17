const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

require('./passport');
require('./routes')(app);

var mongoose = require('mongoose');
mongoose.connect(config.mongo, { useNewUrlParser: true })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));

app.listen(config.port);

const express = require('express');
const api1router = express.Router();

api1router.use('/user', require('../routs/userrout'));


module.exports = api1router
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.role = require('./role.model');
db.user = require('./user.model');

db.ROLES = ['user', 'manager', 'admin'];

module.exports = db;
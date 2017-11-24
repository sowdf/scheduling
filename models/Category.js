let mongoose = require('mongoose');
let categoriesSchemas = require('../schemas/categories');

module.exports = mongoose.model('Category',categoriesSchemas);
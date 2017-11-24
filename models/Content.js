let mongoose = require('mongoose');
let contentsSchemas = require('../schemas/contents');

module.exports = mongoose.model('Content',contentsSchemas);
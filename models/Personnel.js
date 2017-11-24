let mongoose = require('mongoose');
let personnelsSchemas = require('../schemas/personnels');

module.exports = mongoose.model('Personnel',personnelsSchemas);
let mongoose = require('mongoose');
let activitlesSchemas = require('../schemas/activitles');




module.exports = mongoose.model('Activitles',activitlesSchemas);
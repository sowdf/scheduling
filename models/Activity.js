let mongoose = require('mongoose');
let activitiesSchemas = require('../schemas/activities');

module.exports = mongoose.model('Activity',activitiesSchemas);
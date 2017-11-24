let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    position : Number,
    date : {
        default : new Date(),
        type : Date
    },
    name : {
        default:'',
        type : String
    },
    time : {
        default : '',
        type : String
    }

});
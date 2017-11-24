let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name : String,
    date : {
        default : new Date(),
        type : Date
    },
    time : String,
    startYear : Number,
    startMonth : Number,
    startDay : Number,
    endYear : Number,
    endMonth : Number,
    endDay : Number,
    createTime : String,
    principal : String,
    activeType : Number,
    web : {
        default:[],
        type : Object
    },
    server : {
        default:[],
        type : Object
    },
    operating : {
        default:[],
        type : Object
    },
    test : {
        default:[],
        type : Object
    },
    design : {
        default:[],
        type : Object
    }
});
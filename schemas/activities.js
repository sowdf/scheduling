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
    webPersonnel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Personnel'
    },
    testPersonnel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Personnel'
    },
    serverPersonnel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Personnel'
    },

    operatingPersonnel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Personnel'
    },
    designPersonnel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Personnel'
    },
    web : {
        default:{},
        type : Object
    },
    server : {
        default:{},
        type : Object
    },
    operating : {
        default:{},
        type : Object
    },
    test : {
        default:{},
        type : Object
    },
    design : {
        default:{},
        type : Object
    }
});
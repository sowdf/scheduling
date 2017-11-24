let mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    type : {
        type : Number,
        default : 0
    },
    doc : {
        type : String,
        default :'无'
    },
    docHtml : {
        type : String,
        default : '无'
    },
    apiName : {
        type : String,
        default: ''
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    use : {
        type : String,
        default: '无'
    },
    version : {
        type : String,
        default: '3.0.0.0'
    },
    description : {
        type : String,
        default: '无'
    },
    args : {
        type : String,
        default: '无'
    },
    otherDate : {
        default : new Date(),
        type : Date
        
    },
    date : {
        default : '',
        type : String
    },
    returnValue : {
        type : String,
        default: '无'
    }
});
let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name : String,
    sface : {
        type : String,
        default:'http://f1.img4399.com/ma~330_20160927102320_57e9d81887e9e.png?t=1474943000'
    }
});
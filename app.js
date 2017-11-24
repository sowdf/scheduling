const express = require('express');
const path = require('path');

let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let app = express();

app.use(express.static(path.join(__dirname,'public/web/build')));

//设置bodyParser
app.use(bodyParser.urlencoded({extended:true}));

let personnels = require('./routers/personnels');
let activitles = require('./routers/activitles');

app.use('/api/personnels',personnels);
app.use('/api/activitles',activitles);

mongoose.connect('mongodb://localhost:27017/operating',(err)=>{
    if(err){
        return console.log(err);
    }
    app.listen('3000',(err)=>{
        if(err){
            return console.log(err);
        }
        console.log('this is port 9090 starting');
    });
});


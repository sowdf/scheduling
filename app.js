const express = require('express');
const path = require('path');

let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let app = express();

app.use(express.static(path.join(__dirname,'public/web/build')));

//设置bodyParser
app.use(bodyParser.urlencoded({extended:true}));

let personnels = require('./routers/personnels');
let activities = require('./routers/activities');

app.use('/api/personnels',personnels);
app.use('/api/activities',activities);

mongoose.connect('mongodb://localhost:27017/operating',(err)=>{
    if(err){
        return console.log(err);
    }
    app.listen('3000',(err)=>{
        if(err){
            return console.log(err);
        }
        console.log('this is port 3000 starting');
    });
});


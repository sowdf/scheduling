const express = require('express');
const router = express.Router();
const Activitles = require('../models/Activitles');
const Util = require('../util/index');




/*
*   code = 98 参数不足
*   code = 100 请求成功
*   code = 99 已存在
* */
let responseData = {
    code : 100,
    message : '',
    result:{}
};

/*
*  返回对应的数据
*
* */

function sendResponseData(res,message="",code=100,result={}) {
    responseData = {
        code : code,
        message : message,
        result:result
    };
    res.send(responseData);
}

/*
* 中间键
* */

router.use((req,res,next)=>{
    responseData.code = 100;
    responseData.message = '';
    responseData.result = {};
    next();
});

/*
* 增加
* */

router.get('/add',(req,res,next)=>{
    let {query:{startTimestamp,endTimestamp,name,principal,activeType}} = req;
    if(!startTimestamp || !endTimestamp || !name || !principal || !activeType){
        return sendResponseData(res,'参数错误',90);
    };

    let saveData = {
        name : name,
        principal : principal,
        activeType : activeType,
        startYear : Util.timestampConvert(startTimestamp).year,
        startMonth : Util.timestampConvert(startTimestamp).month,
        startDay : Util.timestampConvert(startTimestamp).day,
        endYear : Util.timestampConvert(endTimestamp).year,
        endMonth : Util.timestampConvert(endTimestamp).month,
        endDay : Util.timestampConvert(endTimestamp).day,
        time : Util.getNowFormatDate()
    };
    Activitles.findOne({name:name}).then((data)=>{
        if(data){
            return sendResponseData(res,'该活动已存在',99);
        }
        return new Activitles(saveData);
    }).then(()=>{
        sendResponseData(res,'保存成功',100);
    });

});


/*
* 更新
* */

router.get('/update',(req,res,next)=>{
    let {query:{actId,startTimestamp,endTimestamp,name,principal,activeType}} = req;
    if(!actId || !startTimestamp || !endTimestamp || !name || !principal || !activeType){
        return sendResponseData(res,'参数错误',90);
    };

    let saveData = {
        name : name,
        principal : principal,
        activeType : activeType,
        startYear : Util.timestampConvert(startTimestamp).year,
        startMonth : Util.timestampConvert(startTimestamp).month,
        startDay : Util.timestampConvert(startTimestamp).day,
        endYear : Util.timestampConvert(endTimestamp).year,
        endMonth : Util.timestampConvert(endTimestamp).month,
        endDay : Util.timestampConvert(endTimestamp).day,
        time : Util.getNowFormatDate()
    };
    Activitles.findOne({_id:actId}).then((data)=>{
        if(!data){
            return sendResponseData(res,'修改的活动不存在',99);
        }
        return Activitles.update({_id : id},saveData);
    }).then(()=>{
        sendResponseData(res,'修改成功',100);
    });

});

/*
* 删除
* */

router.get('/delete',(req,res,next)=>{
    let {query:{actId}} = req;
    if(!actId){
        return sendResponseData(res,'参数错误',90);
    };

    Activitles.findOne({_id:actId}).then((data)=>{
        if(!data){
            return sendResponseData(res,'删除的活动不存在',99);
        }
        return Activitles.remove({_id:actId});
    }).then(()=>{
        sendResponseData(res,'删除成功',100);
    });

});


/*
* 删除
* */

router.get('/all',(req,res,next)=>{
    Activitles.find().then((data)=>{
        return sendResponseData(res,'success',100,data);
    })
});

module.exports = router;
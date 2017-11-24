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
        return new Activitles(saveData).save();
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
        return Activitles.update({_id : actId},saveData);
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

/*
* 排期所有活动
* */
router.get('/scheduling/all',(req,res,next)=>{
    let {query:{year,month}} = req;
    if(!year || !month ){
        return sendResponseData(res,'参数错误',90);
    };
    let proxyMonth = Number(month);
    let proxyNextMonth = proxyMonth + 1 > 12 ? 1 : proxyMonth + 1;
    //日期和星期
    let stackDatePicker = (()=>{
        let proxyNowDate = Util.getMonthAry(year,month);
        let proxyNextDate = Util.getMonthAry(year,proxyNextMonth);
        let proxyDate = [proxyNowDate.date,proxyNextDate.date];
        let proxyWeek = [proxyNextDate.week,proxyNextDate.week];
        return {proxyDate,proxyWeek};
    })();
    Activitles.find().then((data)=>{
        let responseData = {
            year : year,
            month : [
                proxyMonth,
                proxyNextMonth
            ],
            date : stackDatePicker.proxyDate,
            week : stackDatePicker.proxyWeek,
            list : data
        };
        sendResponseData(res,'查询成功',100,responseData);
    });
});


/*
* 排期编辑
* */
router.get('/scheduling/edit',(req,res,next)=>{
    let {query:{actId,month}} = req;
    if(!year || !month ){
        return sendResponseData(res,'参数错误',90);
    };
    let proxyMonth = Number(month);
    let proxyNextMonth = proxyMonth + 1 > 12 ? 1 : proxyMonth + 1;
    //日期和星期
    let stackDatePicker = (()=>{
        let proxyNowDate = Util.getMonthAry(year,month);
        let proxyNextDate = Util.getMonthAry(year,proxyNextMonth);
        let proxyDate = [proxyNowDate.date,proxyNextDate.date];
        let proxyWeek = [proxyNextDate.week,proxyNextDate.week];
        return {proxyDate,proxyWeek};
    })();
    Activitles.find().then((data)=>{
        let responseData = {
            year : year,
            month : [
                proxyMonth,
                proxyNextMonth
            ],
            date : stackDatePicker.proxyDate,
            week : stackDatePicker.proxyWeek,
            list : data
        };
        sendResponseData(res,'查询成功',100,responseData);
    });
});

module.exports = router;
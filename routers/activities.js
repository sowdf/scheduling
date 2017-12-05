const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Personnel = require('../models/Personnel');
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
        time : Util.getNowFormatDate(),
        webPersonnel : null,
        serverPersonnel : null,
        operatingPersonnel : null,
        designPersonnel : null,
        testPersonnel : null,
        web : null,
        server :null,
        operating : null,
        test : null,
        design : null
    };

    Activity.findOne({name:name}).then((data)=>{
        if(data){
            return sendResponseData(res,'该活动已存在',99);
        }
        return new Activity(saveData).save();
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
    Activity.findOne({_id:actId}).then((data)=>{
        if(!data){
            return sendResponseData(res,'修改的活动不存在',99);
        }
        return Activity.update({_id : actId},saveData);
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

    Activity.findOne({_id:actId}).then((data)=>{
        if(!data){
            return sendResponseData(res,'删除的活动不存在',99);
        }
        return Activity.remove({_id:actId});
    }).then(()=>{
        sendResponseData(res,'删除成功',100);
    });

});


/*
* 删除
* */

router.get('/all',(req,res,next)=>{
    Activity.find().then((data)=>{
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
    Activity.find().then((data)=>{
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
let proxyCode = -1;
let proxyConflictAry = [];
router.post('/scheduling/edit',(req,res,next)=>{
    let {body:{actId,pid,username,position,year,month,dateList}} = req;
    let proxyDateList = JSON.parse(dateList);
    let posAry = { '1' : 'operating','2' : 'design' ,'3' : 'web' , '4' : 'server' , '5' : 'test'};
    let proxyPos = posAry[position];
    /*let {web,server,operating,test,design} = proxyExt;*/
    Activity.find({_id:actId}).populate('personnel').then((newData)=>{
        if(!newData){
            return sendResponseData(res,'编辑的活动不存在',99,newData);
        }
        //这个月所有的活动
        Activity.find({$or : [{startYear:year},{startMonth:month}]}).populate('personnel').then((data)=>{
            let conflictAry = []; //这个人员已经在做的活动
            data.map((item,index)=>{
                let _id = item[proxyPos+'Personnel'];// 通过位置找到某个端的所r有活动
                //找到这个人的这个月的一个活动 需要对比他和当前编辑的这个活动有么有时间冲图
                if(_id){
                    if((_id == pid) && (item._id != actId)){
                        let isConflict = false;
                        item[proxyPos].dateList.map((subItem,subIndex)=>{
                            proxyDateList.map((cur)=>{
                                if(!cur.type){
                                    let result = Util.isTimestampOverlap(cur,subItem);
                                    if(result){ //true 冲突
                                        isConflict = true;
                                    }
                                }
                            });
                        });
                        if(isConflict){
                            let obj = {
                                _id : item._id,
                                name : item.name
                            }
                            conflictAry.push(obj)
                        }
                    }
                }
            });
            if(conflictAry.length > 0){
                proxyCode = 99;
            }else{
                proxyCode = 100;
            }
            proxyConflictAry = conflictAry;
            let updataData = {
            };
            updataData[proxyPos + 'Personnel'] = pid;
            updataData[proxyPos] = {
                username : username,
                dateList : JSON.parse(dateList)
            };
            return Activity.update({_id:actId},updataData);
        }).then(()=>{
            if(proxyCode == 99){
                return sendResponseData(res,'冲突',99,proxyConflictAry);
            }
            sendResponseData(res,'编辑成功',100,{});
        });
    });
});

module.exports = router;
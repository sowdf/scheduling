const express = require('express');
const router = express.Router();
const Personnel = require('../models/Personnel');

function getNowFormatDate() {

}

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
    let {query:{position}} = req;
    if(position && position > 5){
        return sendResponseData(res,'position错误',99);
    }
    next();
});
/*
*  增加人远
*
* */
router.get('/add',(req,res,next)=>{
    let {query:{name,position}} = req;
    if(!name || !position){
        return sendResponseData(res,'参数不足',90,{});
    }
    let saveData = {
        name : name,
        position : position,
        time : getNowFormatDate()
    };
    new Personnel(saveData).save().then(()=>{
        sendResponseData(res,'添加成功',100,{});
    });

});

/*
*  删除人鱼
*
* */
router.get('/delete',(req,res,next)=>{
    let {query:{id}} = req;
    if(!id){
        return sendResponseData(res,'参数不足',90,{});
    }
    Personnel.findOne({_id:id}).then((data)=>{
        if(!data){
            return sendResponseData(res,'删除的数据不存在',99,{});
        }
        return Personnel.remove({_id:id});
    }).then(()=>{
        return sendResponseData(res,'删除成功',100,{});
    });

});

/*
*  更改人鱼
*
* */
router.get('/update',(req,res,next)=>{
    let {query:{id,name, position}} = req;
    if(!id || !name || !position){
        return sendResponseData(res,'参数不足',90,{});
    }

    let saveData = {
        name : name,
        position : position,
        time : getNowFormatDate()
    };

    Personnel.findOne({_id:id}).then((data)=>{
        if(!data){
            return sendResponseData(res,'更改的数据不存在',99,{});
        }
        return  Personnel.update({_id:id},saveData);
    }).then(()=>sendResponseData(res,'更改成功',100,{}));

});

router.get('/all',(req,res,next)=>{
    Personnel.find().then((data)=>{
        /*  数据整理  */
        let newData = data.toObject();
        let stackData = {
            test : [],
            web : [],
            operating : [],
            design : [],
            server : []
        };
        let stack = (data)=>{
            switch (data.position){
                case 1 :
                    stackData.operating.spush(data);
                    break;
                case 2 :
                    stackData.design.push(data);
                    break;
                case 3 :
                    stackData.web.push(data);
                    break;
                case 4 :
                    stackData.server.push(data);
                    break;
                case 5 :
                    stackData.test.push(data);
                    break;
            }
        };

        newData.map((item,index)=>{
            stack(item);
        });
        sendResponseData(res,'查询成功',100,stackData);
    });
});



module.exports = router;
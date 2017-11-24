let express = require('express');
let router = express.Router();

let Category = require('../models/Category');
let Content = require('../models/Content');

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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
* */

function sendResponseData(message="",code=100,result={}) {
    responseData = {
        code : code,
        message : message,
        result:result
    };
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



/****************************  分类  ***********************************/

/*
*  增加栏目
*  GET
*  @param {name} String
* */

router.get('/category/add',(req,res,next)=>{
    let {query:{name,sface}} = req;
    
    if(!name){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    Category.findOne({
        name : name
    }).then((data)=>{
        if(data){
            responseData.code = 99;
            responseData.message = '类名已存在';
            return res.json(responseData);
        }
        
        /* 不存在 存储 */
        return new Category({
            name : name,
            sface : sface
        }).save();
        
    }).then((newData)=>{
        if(newData){
            responseData.message = '分类增加成功';
            responseData.result = newData;
            res.json(responseData);
        }
    })
});

/*
*  查看所有分类
*  GET
* */

router.get('/category/all',(req,res,next)=>{
    Category.find().then((data)=>{
        responseData.message = '查询成功';
        responseData.result = data;
        res.json(responseData);
    });
});


/*
*  修改栏目
*  GET
*  @param {categoryId} Number
* */

router.get('/category/edit',(req,res,next)=>{
    let {query:{categoryId,name,sface}} = req;
    if(!categoryId || !name){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    
    Category.findOne({
        _id : categoryId
    }).then((data)=>{
        if(!data){
            responseData.code = 99;
            responseData.message = '分类名不存在';
            res.json(responseData);
            return Promise.reject();
        }
        
        return Category.update({_id:categoryId},{name : name,sface:sface});
        
    }).then((newData)=>{
        if(newData){
            responseData.message = '分类修改成功';
            res.json(responseData);
        }
    })
    
});

/*
*  删除栏目
*  GET
*  @param {categoryId} Number
* */

router.get('/category/delete',(req,res,next)=>{
    let {query:{categoryId}} = req;
    if(!categoryId){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    
    Category.findOne({
        _id : categoryId
    }).then((data)=>{
        if(!data){
            responseData.code = 99;
            responseData.message = '分类不存在';
            res.json(responseData);
            return Promise.reject();
        }
        Category.remove({_id:categoryId}).then(()=>{
            responseData.message = '删除成功';
            res.json(responseData);
            return Promise.reject();
        })
    })
    
});

/****************************  分类结束  ***********************************/

/****************************  接口内容  ***********************************/



/*
*  新增API
*  GET
*  @param {categoryId} Number
*
*  {apiName,use,version,description,args,date,returnValue} String
* */

router.post('/content/add',(req,res,next)=>{
    let {body:{apiName,categoryId,use,docHtml,type,version,description,args,date,returnValue,doc}} = req;
    console.log(doc);
    if(!categoryId || !apiName){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    Content.findOne({
        category : categoryId,
        apiName : apiName
    }).then((data)=>{
        if(data){
            responseData.code = 99;
            responseData.message = 'API已存在';
            res.json(responseData);
            return Promise.reject();
        }
        return new Content({
            apiName : apiName,
            category : categoryId,
            use : use,
            version : version,
            description : description,
            args : args,
            date : (new Date()).Format("yyyy-MM-dd hh:mm:ss.S"),
            returnValue : returnValue,
            doc : doc,
            docHtml : docHtml,
            type : type
        }).save();
    }).then((newData)=>{
        responseData.code = 100;
        responseData.message = '增加API成功';
        res.json(responseData);
        return Promise.reject();
    })
});


/*
*  查看分类所有API
*  GET
* */

router.get('/content/category-all',(req,res,next)=>{
    let {query:{categoryId}} = req;
    if(!categoryId){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    
    Content.find({
        category : categoryId
    }).sort({_id:-1}).populate('category').then((data)=>{
        responseData.message = '查询成功';
        responseData.result = data;
        res.json(responseData);
        return Promise.reject();
    })
});

/*
*  查看所有API
*  GET
* */

router.get('/content/all',(req,res,next)=>{
    let proxyData = [];
    Category.find().then((catrgories)=>{
        catrgories.map((item)=>{
            proxyData.push(item.toObject());
        });
        Content.find().populate('category').then((data)=>{
            proxyData.map((item)=>{
                item.apiList = [];
                data.map((apiItem)=>{
                    if(apiItem.category.name == item.name){
                        item.apiList.push(apiItem);
                    }
                });
                return item;
            });
            responseData.message = '查询成功';
            responseData.result = proxyData;
            res.json(responseData);
            return Promise.reject();
        })
    })
   
});



/*
*  修改API
*  POST
*  @param {categoryId} Number
*
*  {contentId,apiName,use,version,description,args,date,returnValue} String
* */

router.post('/content/edit',(req,res,next)=>{
    let {body:{contentId,apiName,categoryId,use,version,description,args,date,returnValue}} = req;
    if(!contentId && !apiName){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    
    Content.findOne({
        _id : contentId
    }).populate('category').then((data)=>{
        if(!data){
            responseData.code = 99;
            responseData.message = '修改的API不存在';
            res.json(responseData);
            return Promise.reject();
        }
        Content.update(
            {_id:contentId},
            {
                apiName : apiName,
                category : categoryId,
                use : use,
                version : version,
                description : description,
                args : args,
                date : (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                returnValue : returnValue
            }
        ).then((data)=>{
            responseData.message = '修改成功';
            res.json(responseData);
            return Promise.reject();
        })
    })
});

/*
*  查看单个Api
*  GET
*  @param {contentId} Number
*
* */

router.get('/content/findOne',(req,res,next)=>{
    let {query:{contentId}} = req;
    if(!contentId){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    
    Content.findOne({
        _id : contentId
    }).populate('category').then((data)=>{
        if(!data){
            responseData.code = 99;
            responseData.message = '查看的API不存在';
            res.json(responseData);
            return Promise.reject();
        }
        responseData.code = 100;
        responseData.message = '查询成功';
        responseData.result = data;
        
        res.json(responseData);
    })
});

/*
*  删除单个Api
*  GET
*  @param {contentId} Number
*
* */

router.get('/content/delete',(req,res,next)=>{
    let {query:{contentId}} = req;
    if(!contentId){
        responseData.code = 98;
        responseData.message = '参数不足';
        return res.json(responseData);
    }
    
    Content.findOne({
        _id : contentId
    }).populate('category').then((data)=>{
        if(!data){
            responseData.code = 99;
            responseData.message = '删除的API不存在';
            res.json(responseData);
            return Promise.reject();
        }
        Content.remove({_id:contentId}).then(()=>{
            sendResponseData('删除成功');
            res.json(responseData);
        });
    })
});
router.get('/search',(req,res,next)=>{
    let {query:{key}} = req;
    const reg = new RegExp(key, 'i')
    Content.find({
        $or : [
            {
                doc:{$regex : reg}
            },
            {
                apiName : {$regex : reg}
            },
            {
                description : {$regex : reg}
            },
            {
                returnValue : {$regex : reg}
            },
            {
                version : {$regex : reg}
            },
            {
                use : {$regex : reg}
            },
            {
                args : {$regex : reg}
            },
            {
                date : {$regex : reg}
            }
        ]
    }).populate('category').then((data)=>{
        if(!data){
            responseData.code = 99;
            responseData.message = '查看的API不存在';
            res.json(responseData);
            return Promise.reject();
        }
        responseData.code = 100;
        responseData.message = '查询成功';
        responseData.result = data;
        
        res.json(responseData);
    })
});
/*
* 搜索
*
* */
/****************************  接口内容结束  ***********************************/
module.exports = router;
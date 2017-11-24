let cheerio = require('cheerio');
let request = require('request');

let option = {

};


request.get('http://project.4399ued.com/apiDoc/youpai/android/_book/',(err,httpResponse,body)=>{
    if(err){
        return console.log(err);
    }
    let link_ary = [];
    const $ = cheerio.load(body);
    for(let i = 0 ; i < 1000; i++){
        let href = $('.chapter a').eq(i).attr('href');
        if(!href){
            break;
        }
        link_ary.push(href);
    }
    
    link_ary.map((item,index)=>{
        if(item == './'){
            return false;
        }
        getApi(item);
    })
    
    return false;
})
function getApi(link){
    request.get('http://project.4399ued.com/apiDoc/youpai/android/_book/' + link,(err,httpResponse,body)=>{
        if(err){
            return console.log(err);
        }
        const $ = cheerio.load(body);
        let apiName = $('.search-noresults h1').text();
        let description = $('.search-noresults h3').eq(0).next('p').text();
        let args =  $('.search-noresults h3').eq(1).next('p').text();
        let returnValue =  $('.search-noresults h3').eq(2).next('p').text();
        let use =  $('.search-noresults h3').eq(3).next().text();
        request.post({url:'http://d.4399ued.com/api/content/add', form:
            {
                "categoryId":'59e4282991f89967cfcbf7af',
                apiName:apiName,
                description:description,
                args : args,
                returnValue : returnValue,
                use : use
            }}, function(err,httpResponse,body){
            console.log(body);
        })
    })
}

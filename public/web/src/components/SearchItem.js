import React,{Component} from 'react';

import {Link} from 'react-router-dom';
export default class SearchItem extends Component{
    constructor(){
        super();
        this.formatStr = this.formatStr.bind(this);
    }
    formatStr(){
        let {searchKey} = this.props;
        let newObj = {};
        let reg = new RegExp(searchKey,'gi');
        for(var k in this.props){
            let item = this.props[k];
            if(typeof item == 'string' ){
                newObj[k] = item.replace(reg,`<b>${searchKey}</b>`);
            }else{
                newObj[k] = item;
            }
            
        }
        return newObj;
    }
    render(){
        let {apiName,date,args,key,category:{name},version,_id,use,returnValue,categoryId,description,doc} = this.formatStr();
        return (
            
            <li className="">
                <Link  to={this.props.type ? `/details_doc/${this.props.categoryId}/${this.props._id}` : `/details/${this.props.categoryId}/${this.props._id}`}>
                    <span>客户端：</span><i>{name}</i>
                    <span>名称：</span><i dangerouslySetInnerHTML={{__html:apiName}}></i>
                    <span>添加时间：</span><i>{date}</i>
                    <span>传入参数：</span><i dangerouslySetInnerHTML={{__html:args}}></i>
                    <span>返回值：</span><i dangerouslySetInnerHTML={{__html:returnValue}}></i>
                    <span>使用方法：</span><i dangerouslySetInnerHTML={{__html:use}}></i>
                    <span>描述：</span><i dangerouslySetInnerHTML={{__html:description}}></i>
                    <span>doc:</span> <i dangerouslySetInnerHTML={{__html:doc}}></i>
                </Link>
            </li>
        )
    }
}
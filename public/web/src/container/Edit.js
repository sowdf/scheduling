
import React,{Component} from 'react';

import Comment from '../layout/Comment';
import ApiListItem from '../components/ApiListItem';
import { Button,message } from 'antd';

const success = (msg) => {
    message.success(msg);
};

const info = (msg) => {
    message.info(msg);
};

export default class ApiList extends Component{
    constructor(){
        super();
        this.state = {
            api : []
        }
        this.submitHandle = this.submitHandle.bind(this);
    }
    componentDidMount() {
        let {match:{params:{categoryId,contentId}}} = this.props;
        fetch('/api/content/findOne?contentId=' + contentId).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            this.setState({
                api : result
            });
        });
    }
    postArgsFormat(json){
        let query = '';
        for(let key in json){
            query+=`${key}=${json[key]}&`
        }
        return query.slice(0,query.length - 2);
    }
    submitHandle(){
        let {match:{params:{categoryId,contentId}}} = this.props;
        let {apiName,description,args,returnValue,use,name,version} = this.refs;
        let submitData = {
            contentId : contentId,
            categoryId : categoryId,
            apiName : apiName.value,
            use : use.value,
            version : version.value,
            description : description.value,
            args : args.value,
            returnValue : returnValue.value,
        }
        fetch("/api/content/edit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: this.postArgsFormat(submitData)
        }).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            if(code == 100){
                window.history.back();
                return success(message);
            }
            info(message);
        });
    }
    render(){
        if(!this.state.api.category){
            return  <Comment> </Comment>;
        }
        let {api:{apiName,args,key,category:{name},version,_id,use,returnValue,categoryId,description}} = this.state;
        return (
            <Comment>
                <ul className="m_api_edit">
                    <li>
                        <span>客户端：</span><span>{name}</span>
                    </li>
                    <li>
                        <p>接口名称:</p>
                        <input ref="apiName" type="text" defaultValue={apiName}/>
                    </li>
                    <li>
                        <p>功能:</p><textarea ref="description" type="text" defaultValue={description}/>
                    </li>
                    <li>
                        <p>参数:</p><input ref="args" type="text" defaultValue={args}/>
                    </li>
                    <li>
                        <p>返回值:</p><input ref="returnValue" type="text" defaultValue={returnValue}/>
                    </li>
                    <li>
                        <p>使用方式:</p><input ref="use" type="text" defaultValue={use}/>
                    </li>
                    <li>
                        <p>新增版本:</p><input ref="version" type="text" defaultValue={version}/>
                    </li>
                </ul>
                <Button type="primary" onClick={this.submitHandle}>提交</Button>
            </Comment>
        
        )
    }
}
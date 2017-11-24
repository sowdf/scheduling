
import React,{Component} from 'react';

import Comment from '../layout/Comment';
import ApiListItem from '../components/ApiListItem';
import { Button,message,DatePicker } from 'antd';


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
        };
        this.submitHandle = this.submitHandle.bind(this);
        this.changeDate = this.changeDate.bind(this);
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
        let {match:{params:{categoryId}}} = this.props;
        let {apiName,description,args,returnValue,use,name,version} = this.refs;
        let submitData = {
            categoryId : categoryId,
            apiName : apiName.value,
            use : use.value,
            version : version.value,
            description : description.value,
            args : args.value,
            returnValue : returnValue.value,
        };
        fetch("/api/content/add", {
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
    changeDate(Moment,date){
        this.refs.date.value = date;
    }
    render(){
        let {match:{params:{categoryName}}} = this.props;
/*        if(!this.state.api.category){
            return  <Comment> </Comment>;
        }
        let {api:{apiName,date,args,key,category:{name},version,_id,use,returnValue,categoryId,description}} = this.state;*/
        return (
            <Comment>
                <ul className="m_api_add">
                    <li>
                        <span>客户端：</span><span>{categoryName}</span>
                    </li>
                    <li>
                        <p>接口名称:</p>
                        <input ref="apiName" type="text"/>
                    </li>
                    <li>
                        <p>功能:</p><textarea ref="description" type="text"/>
                    </li>
                    <li>
                        <p>参数:</p><input ref="args" type="text"/>
                    </li>
                    <li>
                        <p>返回值:</p><input ref="returnValue" type="text"/>
                    </li>
                    <li>
                        <p>使用方式:</p><input ref="use" type="text"/>
                    </li>
                    <li>
                        <p>新增版本:</p><input ref="version" type="text"/>
                    </li>
                </ul>
                <Button type="primary" onClick={this.submitHandle}>提交</Button>
            </Comment>
        
        )
    }
}
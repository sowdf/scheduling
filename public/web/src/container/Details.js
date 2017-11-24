
import React,{Component} from 'react';

import Comment from '../layout/Comment';
import ApiListItem from '../components/ApiListItem';

export default class ApiList extends Component{
    constructor(){
        super();
        this.state = {
            api : []
        }
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
    render(){
        if(!this.state.api.category){
            return  <Comment> </Comment>;
        }
        let {api:{apiName,date,args,key,category:{name},version,_id,use,returnValue,categoryId,description}} = this.state;
        return (
            <Comment>
                <ul className="m_api_details">
                    <li>
                        <span>客户端：</span><span>{name}</span>
                    </li>
                    <li>
                        <span>接口名称:</span><span>{apiName}</span>
                    </li>
                    <li>
                        <span>功能:</span><span>{description}</span>
                    </li>
                    <li>
                        <span>参数:</span><span>{args}</span>
                    </li>
                    <li>
                        <span>返回值:</span><span>{returnValue}</span>
                    </li>
                    <li>
                        <span>使用方式:</span><span>{use}</span>
                    </li>
                    <li>
                        <span>新增版本:</span><span>{version}</span>
                    </li>
                    <li>
                        <span>添加日期:</span><span>{date}</span>
                    </li>
                    
                </ul>
            </Comment>
        
        )
    }
}
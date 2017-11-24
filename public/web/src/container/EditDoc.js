
import React,{Component} from 'react';

import Comment from '../layout/Comment';
import ApiListItem from '../components/ApiListItem';
import SimpleMDE from 'simplemde';
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
        }
        this.submitHandle = this.submitHandle.bind(this);
    }
    componentDidMount() {
        let {match:{params:{categoryId,contentId}}} = this.props;
        this.simplemde = new SimpleMDE({
            element: this.refs.edit[0],
            autosave : {
                enabled : true,
                delay : 3,
                uniqueId : 'api-doc'
            }
        });
       /* this.simplemde.codemirror.on("change", ()=>{
            let markdownHtml = this.simplemde.markdown(this.simplemde.value());
            this.doc = markdownHtml;
        });*/
        fetch('/api/content/findOne?contentId=' + contentId).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            this.setState({
                api : result,
            });
            this.simplemde.value(result.doc);1221
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
        let doc = this.simplemde.value();
        let markdownHtml = this.simplemde.markdown(doc);
        this.doc = doc;
        this.docHtml = markdownHtml;
    
        let {match:{params:{categoryId,contentId}}} = this.props;
        let {apiName} = this.refs;
        let submitData = {
            contentId : contentId,
            categoryId : categoryId,
            apiName : apiName.value,
            doc : this.doc,
            docHtml : this.docHtml,
            type : 1 //1 代表 文档
        };
        
        fetch("/api/content/edit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: this.postArgsFormat(submitData)
        }).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            if(code == 100){
                this.simplemde.value('');
                window.history.back();
                return success(message);
            }
            info(message);
        });
    }
    onChangeHandle(e){
        let newDate = this.state.api;
        newDate.apiName = e.target.value;
        this.setState({
            api : newDate
        });
    }
    render(){
        let {match:{params:{categoryId,categoryName}}} = this.props;
        let {api:{apiName,doc}} = this.state;
        return (
            <div className="container container-narrow m_add_doc">
                <div className="header">
                    <ul>
                        <li>
                            客户端：{categoryName}
                        </li>
                        <li>
                            标题：<input type="text" ref="apiName" value={apiName} onChange={this.onChangeHandle.bind(this)}/>
                        </li>
                    </ul>
                    <Button type="primary" onClick={this.submitHandle}>提交</Button>
                </div>
                <textarea ref="edit">
                
                </textarea>
            </div>
        )
    }
}
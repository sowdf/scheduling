import React,{Component} from 'react';
import SimpleMDE from 'simplemde';
import { Button,message,DatePicker } from 'antd';


const success = (msg) => {
    message.success(msg);
};

const info = (msg) => {
    message.info(msg);
};

export default class AddDoc extends Component{
    constructor(){
        super();
        this.submitHandle = this.submitHandle.bind(this);
        this.postArgsFormat = this.postArgsFormat.bind(this);
        this.doc = '';
        this.docHtml = '';
    }
    componentDidMount() {
         this.simplemde = new SimpleMDE({
            element: this.refs.edit[0],
            autosave : {
                enabled : true,
                delay : 100,
                uniqueId : 'api-doc'
            }
        });
       /* this.simplemde.codemirror.on("change", ()=>{
            let doc = this.simplemde.value();
            let markdownHtml = this.simplemde.markdown(doc);
            this.doc = doc;
            this.docHtml = markdownHtml;
        });*/
    }
    postArgsFormat(json){
        let query = '';
        for(let key in json){
            query+=`${key}=${json[key]}&`
        }
        return query.slice(0,query.length - 1);
    }
    submitHandle(){
        let doc = this.simplemde.value();
        console.log(doc);
        let markdownHtml = this.simplemde.markdown(doc);
        this.doc = doc;
        this.docHtml = markdownHtml;
        
        let {match:{params:{categoryId,type}}} = this.props;
        let {apiName} = this.refs;
        let submitData = {
            categoryId : categoryId,
            apiName : apiName.value,
            doc : this.doc,
            docHtml : this.docHtml,
            type : 1 //1 代表 文档
        };
        console.log(this.postArgsFormat(submitData));
        fetch("/api/content/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
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
    render(){
        let {match:{params:{categoryId,categoryName}}} = this.props;
        return (
            <div className="container container-narrow m_add_doc">
                <div className="header">
                    <ul>
                        <li>
                            客户端：{categoryName}
                        </li>
                        <li>
                            标题：<input type="text" ref="apiName"/>
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
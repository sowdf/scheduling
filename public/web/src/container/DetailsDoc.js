
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
        if(!this.state.api.doc){
            return  <Comment> </Comment>;
        }
        let {api:{apiName,date,doc,docHtml}} = this.state;
        return (
            <Comment>
                <div className="m_details_doc">
                    <h3>{apiName}</h3>
                    <p className="time">
                        添加时间：{date}
                    </p>
                    <div className="content" dangerouslySetInnerHTML={{__html:docHtml}}>
                    </div>
                    
                </div>
                
            </Comment>
        
        )
    }
}
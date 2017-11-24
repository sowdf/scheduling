import React,{Component} from 'react';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

export default class ApiListItem extends Component{
    render(){
      
        let {apiName,date,args,key,version,_id,use,type,returnValue,categoryId,description} = this.props;
        return (
            <li>
                <span>{apiName}</span>
                <span className="desc">{description}</span>
                <div className="link">
                    <Link to={type ? `/edit_doc/${categoryId}/${_id}` : `/edit/${categoryId}/${_id}`}>
                        修改
                    </Link>
                    <Link  to={type ? `/details_doc/${categoryId}/${_id}` : `/details/${categoryId}/${_id}`}>
                        查看
                    </Link>
                </div>
            </li>
        )
    }
}
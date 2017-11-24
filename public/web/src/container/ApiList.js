import React,{Component} from 'react';

import Comment from '../layout/Comment';
import ApiListItem from '../components/ApiListItem';
import {Button,Modal,Table} from 'antd';
import {Link} from 'react-router-dom';

export default class ApiList extends Component{
    constructor(){
        super();
        this.state = {
            api_list : []
        }
        this._renderManageLink = this._renderManageLink.bind(this);
    }
    componentDidMount() {
        let {match:{params:{categoryId}}} = this.props;
        fetch('/api/content/category-all?categoryId=' + categoryId).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            result.map((item,index)=>{
                item.key = index;
                if(item.description && item.description.length > 30){
                    item.description = item.description.slice(0,30) + '...';
                }
                if(item.description && item.use.length > 30){
                    item.use = item.use.slice(0,30) + '...';
                }
            });
            this.setState({
                api_list : result
            });
        });
    }
    _renderManageLink(text,record){
        let {apiName,date,args,key,version,_id,use,type,returnValue,categoryId,description} = record;
        return <div className="m_link_box">
            <Link to={type ? `/edit_doc/${categoryId}/${_id}` : `/edit/${categoryId}/${_id}`}>
                <Button type="primary">修改</Button>
            </Link>
            <Link  to={type ? `/details_doc/${categoryId}/${_id}` : `/details/${categoryId}/${_id}`}>
                <Button type="primary">查看</Button>
            </Link>
        </div>
    }
    _renderCsolumns(){
        const columns = [
            {
                title: '名称',
                dataIndex: 'apiName',
                key: 'apiName',
            },
            {
                title: '功能描述',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title : '参数',
                dataIndex: 'args',
                key : 'args'
            },
            {
                title : '使用方法',
                dataIndex: 'use',
                key : 'use'
            },
            {
                title : '返回值',
                dataIndex: 'returnValue',
                key : 'returnValue'
            },
            {
                title : '添加版本',
                dataIndex: 'version',
                key : 'version'
            },
            {
                title : '管理',
                render : this._renderManageLink
            }
        ];
        return columns;
    }
    render(){
        let {api_list} = this.state;
        let {match:{params:{categoryId,categoryName}}} = this.props;
        if(api_list.length == 0){
            return <Comment>
                <header className="m_list_header">
                    <Link to={`/add/${categoryName}/${categoryId}/0`} >
                        <Button type="primary">新增api</Button>
                    </Link>
                    <Link to={`/add/${categoryName}/${categoryId}/1`}>
                        <Button type="primary">新增api文档</Button>
                    </Link>
                </header>
            </Comment>
        }
   
    
        return (
            <Comment>
                <header className="m_list_header">
                    <Link to={`/add/${categoryName}/${categoryId}/0`} >
                        <Button type="primary">新增api</Button>
                    </Link>
                    <Link to={`/add/${categoryName}/${categoryId}/1`}>
                        <Button type="primary">新增api文档</Button>
                    </Link>
                </header>
                <Table
                    dataSource={api_list}
                    columns={this._renderCsolumns()}
                />
              {/*  <ul className="m_api_list">
                    {
                        api_list.map((item,index)=>{
                            return <ApiListItem
                                key={index}
                                {...item}
                                categoryId={categoryId}
                            />
                        })
                    }
                </ul>*/}
            </Comment>
           
        )
    }
}
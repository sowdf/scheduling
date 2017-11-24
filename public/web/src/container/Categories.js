import React,{Component} from 'react';


import Comment from '../layout/Comment';
import ApiListItem from '../components/ApiListItem';
import { Button,message,DatePicker,Table, Input } from 'antd';
import {Link} from 'react-router-dom';

const success = (msg) => {
    message.success(msg);
};

const info = (msg) => {
    message.info(msg);
};


const columns = [
    {
        title: '栏目名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '图片',
        dataIndex: 'sface',
        key: 'sface',
    },
    {
        title : '管理',
        dataIndex: 'manage',
        key : 'manage'
    }
];



export default class Categories extends Component{
    constructor(){
        super();
        this.state = {
            categories : []
        };
        this.addOnOff = true;
        this.editOnOff = true;
        this.lastClick = {};
        this._renderManage = this._renderManage.bind(this);
        this.stackColumns = this.stackColumns.bind(this);
        this.addCategoryHandle = this.addCategoryHandle.bind(this);
    }
    componentDidMount() {
        fetch('/api/category/all').then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            result = this.formatData(result);
            this.setState({
                categories : result
            });
        });
    }
    clickHandle(){
    }
    addCategoryHandle(){
        if(!this.addOnOff){
            return false;
        }
        this.addOnOff = false;
    
        let newData = this.state.categories;
    
        if(this.lastClick.name){ // 判断是否存 上一次点击 如果存在 就将上一次的还原回去
            newData[this.lastClick.key] = this.lastClick;
        }
    
       
        let fillData = {
            type : 2,
            name : <Input type="text" ref={name=>this.name=name} placeholder="请输入分类名"/>,
            sface : <Input type="text" ref={sface=>this.sface=sface} placeholder="请输入分类封面地址"/>
        }
        
        this.setState({
            categories : newData.concat(fillData)
        });
        
    }
   
    editHandle(index){
        if(!this.addOnOff){
            info('您在新增中，不能修改~');
            return false;
        }
        if(!this.editOnOff){
           return false;
        }
        this.editOnOff = false;
        let newData = this.state.categories;
        if(this.lastClick.name){ // 判断是否存 上一次点击 如果存在 就将上一次的还原回去
            newData[this.lastClick.key] = this.lastClick;
        }
        this.lastClick = {
            type :  newData[index].type,
            name : newData[index].name,
            sface :  newData[index].sface,
            key : newData[index].key,
            _id : newData[index]._id
        };
        
        newData[index].type = 1;
        newData[index].name = <Input type="text" ref={name=>this.name=name} defaultValue={newData[index].name}/>
        newData[index].sface = <Input type="text" ref={sface=>this.sface=sface} defaultValue={newData[index].sface}/>
        this.setState({
            categories : newData
        });
    }
    addSaveHandle(){
        let name = this.name.refs.input.value;
        let sface = this.sface.refs.input.value;
        
        fetch(`/api/category/add?name=${name}&sface=${sface}`).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            if(code == 100){
                this.addOnOff = true;
                let newData = this.state.categories;
                result.key = newData.length - 1;
                result.type = 0;
                newData[newData.length - 1] = result;
                
                this.setState({
                    categories : newData
                });
                return success(message);
            }
            info(message);
        });
    }
    editSaveHandle(data){
        let {_id,key} = data;
        let name = this.name.refs.input.value;
        let sface = this.sface.refs.input.value;
        fetch(`/api/category/edit?categoryId=${_id}&name=${name}&sface=${sface}`).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            if(code == 100){
                this.editOnOff = true;
                let newData = this.state.categories;
                newData[key].name = name;
                newData[key].sface = sface;
                newData[key].type = 0;
                this.setState({
                    categories : newData
                });
                return success(message);
            }
            info(message);
            
        });
    }
    _renderManage(text,record){
        let { type , key } = record;
        if(type == 0){
            return <Button type="primary" onClick={this.editHandle.bind(this,key)}>修改</Button>
        }else if ( type == 1){
            return <Button type="primary" onClick={this.editSaveHandle.bind(this,record)}>保存</Button>
        }else if (type == 2){
            return <Button type="primary" onClick={this.addSaveHandle.bind(this)}>保存</Button>
        }
        
    }
    stackColumns(){
        return  [
            {
                title: '栏目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '图片',
                dataIndex: 'sface',
                key: 'sface',
            },
            {
                title : '管理',
                dataIndex: 'manage',
                key : 'manage',
                render : this._renderManage
            }
        ];
    }
    formatData(data){
        data.map((item,index)=>{
            item.key = index;
            item.type = 0;
            return item;
        });
        return data;
    }
    render(){
        let {categories} = this.state;
        if(categories.length == 0){
            return <Comment>
                <header className="m_list_header">
                    <Button type="primary" onClick={this.addCategoryHandle}>新增分类</Button>
                </header>
            </Comment>
        }
        return (
            <Comment>
                <header className="m_list_header">
                    <Button type="primary" onClick={this.addCategoryHandle}>新增分类</Button>
                </header>
                <Table dataSource={categories} columns={this.stackColumns()} />
            </Comment>
        )
    }
}
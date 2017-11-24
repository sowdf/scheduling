import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    HashRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import Comment from '../layout/Comment';


class App extends React.Component{
    constructor(){
        super();
        this.state = {
            category : [],
            apiItem : {}
        }
        this.selectHandle = this.selectHandle.bind(this);
    }
    componentDidMount() {
        fetch('/api/content/all').then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
            this.setState({
                category : result
            });
        });
    }
    selectHandle({item,key,keyPath}){
        let newContent = this.state.category[keyPath[1]].apiList[keyPath[0]];
        this.setState({
            apiItem : Object.assign({},this.state.apiItem,newContent)
        });
    }
    render(){
        let {category,apiItem:{apiName,description,args,date,returnValue,use,version}} = this.state;
        console.log(category);
        return (
            <Comment>
                <ul className="m_category">
                    {
                        category.map((item,index)=>{
                            return <li key={index}>
                                <Link to={`/list/${item.name}/${item._id}`}>
                                    <img src={item.sface} alt=""/>
                                    <p>{item.name}</p>
                                </Link>
                            </li>
                
                        })
                    }
                </ul>
            </Comment>
           
        )
    }
}


export default App;
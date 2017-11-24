
import React,{Component} from 'react';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import {Link} from 'react-router-dom';


export default class Comment extends Component{
    onClickHandle(item){
    }
    render(){
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" >
                        api-doc
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                        onClick={this.onClickHandle}
                    >
                        <Menu.Item key="1">
                            <Link to="/">
                                API
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/categories">
                                分类管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/search">
                                搜索
                            </Link>
                        </Menu.Item>
                        
                    </Menu>
                </Header>
                <Layout>
                    <Layout style={{ padding: '0 24px 24px',margin:'20px 0 0 0' }}>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            {
                                this.props.children
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
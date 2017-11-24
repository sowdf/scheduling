import React,{Component} from 'react';
import Comment from '../layout/Comment';
import { Input ,message} from 'antd';
const SearchInput = Input.Search;
import SearchItem from '../components/SearchItem';
const success = (msg) => {
    message.success(msg);
};

const info = (msg) => {
    message.info(msg);
};

export default class Search extends Component{
    constructor(){
        super();
        this.state = {
            list : []
        }
        this.onChangeHandle = this.onChangeHandle.bind(this);
    }
    onChangeHandle(value){
        this.searchKey = value;
        fetch('/api/search?key=' + value).then(response=>response.json()).then((data)=>{
            let {message,code,result} = data;
           
            if(code == 100){
                this.setState({
                    list : result
                });
            }
            if(result.length == 0){
                info('您搜索的内容不存在~')
            }else{
                success(message);
            }
        });
    }
    
    render(){
        let {list} = this.state;
        return (
            <Comment>
                <div className="m_search">
                    <div className="box">
                        <SearchInput
                            placeholder="input search text"
                            style={{
                                display:'block',
                                width: 500,
                                margin:'50px auto',
                                height:46,
                                fontSize:'16px'
                            }}
                            onSearch={this.onChangeHandle}
                        />
                    </div>
                    <div className="result">
                        <ul>
                            {
                                list.map((item,index)=> {
                                    return <SearchItem searchKey={this.searchKey} key={index} {...item}/>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </Comment>
        )
    }
}
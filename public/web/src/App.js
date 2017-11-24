import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import 'antd/lib/button/style/css';
import './style/layout.css';
import './scss/style.scss';

import Home from './container/Home';
import ApiList from './container/ApiList';
import Details from './container/Details';
import Edit from './container/Edit';
import EditDoc from './container/EditDoc';
import Add from './container/Add';
import AddDoc from './container/AddDoc';
import DetailsDoc from './container/DetailsDoc';
import Search from './container/Search';
import Categories from './container/Categories';
import DatePicker from './container/DatePicker';
const App = () => (
    <Router>
        <div>
            <Route exact path="/" component={Home}/>
            <Route path="/list/:categoryName/:categoryId" component={ApiList}/>
            <Route path="/details/:categoryId/:contentId" component={Details}/>
            <Route path="/details_doc/:categoryId/:contentId" component={DetailsDoc}/>
            <Route path="/edit/:categoryId/:contentId" component={Edit}/>
            <Route path="/edit_doc/:categoryId/:contentId" component={EditDoc}/>
            <Route path="/add/:categoryName/:categoryId/0" component={Add}/>
            <Route path="/add/:categoryName/:categoryId/1" component={AddDoc}/>
            <Route path="/categories" component={Categories}/>
            <Route path="/add/category" component={Categories}/>
            <Route path="/search" component={Search}/>
            <Route path="/datePicker" component={DatePicker}/>
        </div>
    </Router>
)
export default App;
import React from 'react'
import {Row,Col} from 'antd'
import 'antd/dist/antd.css';
import Header from './components/Header'
import Footer from './components/Footer'
import NavLeft from './components/NavLeft'
import './style/common.css'
import Home from './pages/home'
export default class Admin extends React.Component{
    render (){
        return (
        <Row className ='container'>
            <Col span= {4} className ='nav-left'>
            <NavLeft/>
            </Col>
            <Col span={20} className ='main'>
                <Header/>
                <Row className="content">
                {/* <Home/> */}
               {/*  挂载子组件路由 */}
                {this.props.children}
                </Row>
                <Footer/>
            </Col>
        
        </Row>
        );
    }
}
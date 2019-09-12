import React from 'react'
import { Link } from 'react-router-dom'
export default class Main extends React.Component {

    render() {
        return (
            <div>
                this is main page.
                <br/>
               {/*  嵌套路由链接路径 + 动态参数 */}
                <Link to="/main/test-id">嵌套路由1</Link>
                <br/>
                <Link to="/main/456">嵌套路由2</Link>
                <hr/>
                {this.props.children}
            </div>
        );
    }
}
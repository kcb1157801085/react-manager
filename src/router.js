  import React from 'react' 
 
  import {HashRouter ,Route ,Switch,Redirect} from 'react-router-dom'
  /* 导入组件 */
  import App from './App'
import Login from './pages/login'
import Admin from './admin'
import Buttons from './pages/ui/buttons'
import Modals from './pages/ui/modals'
import Carousels from './pages/ui/carousel'
import Loadings from './pages/ui/loadings'
import Messages from './pages/ui/messages'
import Tabs from './pages/ui/tabs'
import Gallery from './pages/ui/gallery'
import Notice from './pages/ui/notice'
import FormLogin from './pages/form/login'
import  FormRegister  from './pages/form/register'
import BasicTable from './pages/table/basicTable'
import HighTable from './pages/table/highTable'
import City from './pages/city/index'
import Order from './pages/order/index'
import Common from './common'
import OrderDetail from './pages/order/detail'
import User from './pages/user/index'
import BikeMap from './pages/map/bikeMap'
import Bar from './pages/echarts/bar'
import Pie from './pages/echarts/pie'
import Line from './pages/echarts/line'
import RichText from './pages/rich'
import Permission from './pages/permission'

/* import NoMatch from './pages/nomatch' */
import Home from './pages/home'

  export default class Router extends React.Component{
      render(){
          return (
          <HashRouter>
<App>
  <Switch>
    {/* <Route path='/login' component={Login}></Route> */}
    <Route path="/common" render={() =>
    <Common>
     <Route path="/common/order/detail/:orderId" component={OrderDetail} />
    </Common>}/>
    <Route path='/' render={()=>
    <Admin>
       <Switch>
         <Route path='/home' component={Home} />
         <Route path='/ui/buttons' component={Buttons}></Route>
         <Route path='/ui/carousel' component={Carousels}></Route>
         <Route path='/ui/modals' component ={Modals}></Route>
         <Route path='/ui/loadings' component= {Loadings}></Route>
         <Route path='/ui/messages' component= {Messages}></Route>
         <Route path='/ui/tabs' component ={Tabs}></Route>
         <Route path='/ui/gallery' component ={Gallery}></Route>
         <Route path='/ui/notification' component = {Notice}></Route>
         <Route path='/form/login' component={FormLogin}></Route>
         <Route path='/form/reg' component = {FormRegister}></Route>
         <Route path='/table/basic' component={BasicTable}></Route>
         <Route path='/table/high' component ={HighTable}></Route>
         <Route path='/city' component={City}></Route>
         <Route path="/order" component={Order}></Route>
         <Route path='/user' component={User}></Route>
         <Route path='/bikeMap' component={BikeMap}></Route>
         <Route path='/charts/bar' component={Bar}></Route>
         <Route path='/charts/pie' component={Pie}></Route>
         <Route path='/charts/line' component={Line}></Route>
         <Route path='/rich' component={RichText}></Route>
         <Route path='/permission' component={Permission}></Route>
          {/* 重定向 */}
          <Redirect to='/home' />
         {/* 找不到页面时 */}
{/*          <Route component = {NoMatch} /> */}
        
         
       </Switch>
    </Admin>
    } />
</Switch>
</App>
          </HashRouter>
          )
             }
  }